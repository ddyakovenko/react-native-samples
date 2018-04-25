import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    Text,
    LayoutAnimation,
} from 'react-native';
import PropTypes from 'prop-types';
import FBSDK from 'react-native-fbsdk';
import * as firebase from "firebase";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { OrangeButton, FbButton, SignButton } from '../components/buttons/SignButtons';
import Texts from '../config/texts';
import Colors from '../styles/colors';
import { signupUser, setEnterWay, setCurrentTab } from '../actions/index';
import { persistor } from '../store';

const {
    LoginManager,
    GraphRequest,
    GraphRequestManager,
    AccessToken,
} = FBSDK;

class _Welcome extends Component {
    static navigationOptions = {
        header: ({ state }) => ({
            visible: false,
        })
    };

    constructor (props) {
        super(props);

        this.state = {
            isButtonBlockShown: false,
            isLoginMode: false,
        };
    }

    componentWillReceiveProps (newProps) {
        if (newProps.enterWay) {
            this.setState({ isLoginMode: newProps.enterWay === 'login' });
        }
    }

    showLogin (isLogin) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({
            isButtonBlockShown: true,
        });
        this.props.setEnterWay(isLogin && 'login' || 'signup');
    }

    hideButtonBlock () {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({
            isButtonBlockShown: false,
        });
    }

    // set and get fb access token
    loginFb () {
        const _self = this;
        LoginManager.logInWithReadPermissions(['email', 'public_profile']).then(
            function(result) {
                if (result.isCancelled) {
                    alert('Login cancelled');
                } else {
                    AccessToken.getCurrentAccessToken().then(
                        (data) => {
                            _self._fbGetInfo(data.accessToken.toString());
                        }
                    );
                }
            },
            function(error) {
                alert('Login fail with error: ' + error);
            }
        );
    }

    // get user info from fb
    _fbGetInfo (token) {
        const _self = this;
        // list of fields: https://developers.facebook.com/docs/facebook-login/permissions/#reference-public_profile
        const infoRequest = new GraphRequest(
            '/me/?fields=id,name,cover,email,age_range,link,gender,locale,picture',
            null,
            (err, res) => {
                if (err) {
                    alert('Error fetching Facebook data: ' + err.toString());
                } else {
                    _self._firebaseSignin(res, token);
                }
            },
        );
        new GraphRequestManager().addRequest(infoRequest).start();
    }

    // does firebase.auth, get user data from firebase and then register user if it doesn't exist yet
    _firebaseSignin (fbData, token) {
        const _self = this;
        const names = fbData.name.split(' ');
        const { id, email, cover = null, age_range = null, link = null, gender = null, locale = null } = fbData;
        const user = {
            firstName: names[0],
            lastName: names[1],
            pic_url: fbData.picture.data.url,
            email,
            cover,
            age_range,
            link,
            gender,
            locale,
        };

        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        firebase.auth().signInWithCredential(credential)
            .then((res) => {
                const userId = firebase.auth().currentUser.uid;
                // get user info
                firebase.database().ref('users/' + userId).once('value')
                    .then((userSnapshot) => {
                        if (!userSnapshot.val()) {
                            // if user doesn't exist, need to create
                            firebase.database().ref('users/' + userId).set(user)
                                .then(() => {
                                    _self._remember(user);
                                })
                                .catch((err) => {
                                    alert('Error setting user: ' + err.toString());
                                })
                        } else {
                            _self._remember(user);
                        }
                    })
                    .catch((err) => {
                        alert('Error fetching user data: ' + err.toString());
                    });
            })
            .catch((error) => alert('Account disabled'));
    }

    // save user info in app
    _remember (user) {
        this.props.signupUser(user);
        persistor.rehydrate({user: {user, isLoggedIn: true}});
        this.props.setCurrentTab('CourseNavigator');
        this.props.navigation.navigate('Main');
    }

    render () {
        const { navigate } = this.props.navigation;
        const { isButtonBlockShown, isLoginMode } = this.state;
        return(
            <TouchableWithoutFeedback onPress={this.hideButtonBlock.bind(this)}>
                <Image style={styles.backgroundImage} source={require('../../images/sw-back.png')}>
                    <View>
                        <OrangeButton
                            onPress={this.showLogin.bind(this, false)}
                            label={Texts.welcomeButton}
                        />
                        <TouchableWithoutFeedback onPress={this.showLogin.bind(this, true)}>
                            <View style={styles.textWrapper}>
                                <Text style={styles.text}>{Texts.welcomeLoginText}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={[styles.buttonBlock, { bottom: !isButtonBlockShown && -212 || 0 }]}>
                        <FbButton
                            onPress={this.loginFb.bind(this)}
                            label={isLoginMode && Texts.loginButton || Texts.signupButton}
                            isLogin={isLoginMode}
                        />
                        <SignButton
                            onPress={() => {navigate('Signup')}}
                            label={isLoginMode && Texts.loginButton || Texts.signupButton}
                            isLogin={isLoginMode}
                        />
                    </View>
                </Image>
            </TouchableWithoutFeedback>
        );
    }
}

_Welcome.proptypes = {
    navigation: PropTypes.object,
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        alignSelf: 'stretch',
        width: null,
        justifyContent: 'flex-end',
    },
    textWrapper: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
    },
    text: {
        color: Colors.mainWhite,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonBlock: {
        position: 'absolute',
        backgroundColor: Colors.mainWhite,
        height: 212,
        paddingTop: 32,
        paddingBottom: 46,
    },
});

function mapStateToProps(store) {
    return {
        enterWay: store.user.enterWay,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({signupUser, setEnterWay, setCurrentTab}, dispatch)
}

export const Welcome = connect(mapStateToProps, mapDispatchToProps)(_Welcome);
