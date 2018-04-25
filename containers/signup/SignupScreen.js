import React, { Component } from 'react';
import {
    Dimensions,
    Alert,
    Keyboard,
    View,
    Text,
    Image,
    DeviceEventEmitter,
    StyleSheet,
    LayoutAnimation,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as firebase from "firebase";
import { persistor } from '../../store';

import { signupUser, signinUser, setCurrentTab } from '../../actions/index';
import Texts from '../../config/texts';
import Colors from '../../styles/colors';
import FooterTextButtonBlock from './components/FooterTextButtonBlock';
import ValidatedStyledInput from '../../components/ValidatedStyledInput';

const deviceHeight = Dimensions.get('window').height;

class _Signup extends Component {
    static navigationOptions = {
        header: ({ state }) => ({
            visible: false,
        })
    };

    initialSizes = {
        screenHeight: deviceHeight,
        formHeight: 360,
        innerFormMarginBottom: 23,
        innerFormMarginTop: 37,
        secondFormHeight: 412,
    };

    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            response: '',
            isLoginShown: props.enterWay === 'login',
            activeStep: 0,
            ...this.initialSizes
        };

        this.references = {};
    }

    componentWillMount () {
        this.keyboardDidShowListener = DeviceEventEmitter.addListener('keyboardDidShow', this.keyboardDidShow.bind(this));
        this.keyboardDidHideListener = DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    keyboardDidShow (e) {
        let _newState = {};

        if (this.state.isLoginShown || this.state.activeStep === 0) {
            // e.endCoordinates.screenY shows the free height of the screen
            _newState.formHeight = this.state.formHeight;

            if (e.endCoordinates.screenY < this.state.formHeight) {
                // start thinking how we can make form lower

                //then we can decrease marginTop & marginBottom of innerForm
                if (e.endCoordinates.screenY < 300) {
                    (e.endCoordinates.screenY > 263)
                        ? (_newState.innerFormMarginTop = 300 - e.endCoordinates.screenY)
                        : (_newState.innerFormMarginTop = 0);
                }
                if (e.endCoordinates.screenY < 263) {
                    (e.endCoordinates.screenY > 240)
                        ? (_newState.innerFormMarginBottom = 263 - e.endCoordinates.screenY)
                        : (_newState.innerFormMarginBottom = 0);
                }
                // it's possible to decrease form height to 300px
                (e.endCoordinates.screenY > 300)
                    ? (_newState.formHeight = e.endCoordinates.screenY)
                    : (_newState.formHeight = 240 + _newState.innerFormMarginBottom + _newState.innerFormMarginTop);
            }
            _newState.screenHeight = e.endCoordinates.screenY;
        } else {
            // e.endCoordinates.screenY shows the free height of the screen
            if (e.endCoordinates.screenY < this.state.secondFormHeight) {
                // it's possible to decrease form height because innerForm is scrollable
                _newState.secondFormHeight = e.endCoordinates.screenY;
            }
            _newState.screenHeight = e.endCoordinates.screenY;
        }

        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        this.setState(_newState);
    }

    keyboardWillHide (e) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        if (this.references.scrollView) {
            this.references.scrollView.scrollTo({ x: 0, y: 0, animated: true });
        }
        this.setState(this.initialSizes);
    }

    setValue (field, value) {
        const _newState = {};
        _newState[field] = value;
        this.setState(_newState);
    }

    returnToPreviousStep () {
        this.setState({ activeStep: 0 });
    }

    async signIn () {
        Keyboard.dismiss();

        const { email, password } = this.state;
        const { navigate } = this.props.navigation;
        if (!password.length || email.indexOf('@') < 0) {
            Alert.alert(
                'Error',
                'Please enter valid email and password'
            );
            return;
        }

        if (this.state.isLoginShown) {
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password);
                this.props.signinUser({email, password});
                persistor.rehydrate({user: {isLoggedIn: true}});
                this.props.setCurrentTab('CourseNavigator');
                navigate('Main');
            } catch (error) {
                this.setState({
                    response: error.toString()
                });
                Alert.alert(
                    'Error',
                    this.state.response
                );
            }
        } else {
            this.setState({ activeStep: 1 });
        }
    }

    async checkInfoBeforeSignup() {
        Keyboard.dismiss();

        const { firstName, lastName, username, email, password } = this.state;
        const { navigate } = this.props.navigation;
        if (firstName.length < 1 || lastName.length < 1) {
            Alert.alert(
                'Error',
                'Please enter valid first and last name'
            );
            return;
        }

        try {
            await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);

            this.setState({
                response: "account created"
            });

            const userId = firebase.auth().currentUser.uid;
            await firebase.database().ref('users/' + userId).set({
                firstName,
                lastName,
                email,
                username: username || null,
            });

            console.log('signup success');

            this.props.signupUser({
                firstName,
                lastName,
                name: username || `${firstName} ${lastName} ${Math.random()*100000}`,
                email,
                password,
            });
            persistor.rehydrate({user: {isLoggedIn: true}});
            this.props.setCurrentTab('CourseNavigator');
            navigate('Main');

        } catch (error) {
            this.setState({
                response: error.toString()
            });
            Alert.alert(
                'Error',
                this.state.response
            );
            console.log(error.toString())
        }

    }

    renderLoginForm () {
        const innerFormSize = {
            marginTop: this.state.innerFormMarginTop,
            marginBottom: this.state.innerFormMarginBottom,
            height: this.state.formHeight - 55 - this.state.innerFormMarginTop - this.state.innerFormMarginBottom,
        };
        const { isLoginShown } = this.state;

        return (
            <View style={[styles.form, { height: this.state.formHeight }]}>
                <View style={[styles.innerForm, innerFormSize]}>
                    <Text style={styles.title}>{isLoginShown && 'LOG IN' || 'SIGN UP'}</Text>
                    {
                        !isLoginShown &&
                        (
                            <View style={styles.progressBar}>
                                <View style={styles.active}></View>
                                <View style={styles.inactive}></View>
                            </View>
                        )
                    }
                    <ValidatedStyledInput
                        label={Texts.emailLabel}
                        placeholder={Texts.emailPlaceholder}
                        keyboardType="email-address"
                        onChangeText={this.setValue.bind(this, 'email')}
                        value={this.state.email}
                    />
                    <ValidatedStyledInput
                        label={Texts.passwordLabel}
                        placeholder={Texts.passwordPlaceholder}
                        secureTextEntry={true}
                        onChangeText={this.setValue.bind(this, 'password')}
                        value={this.state.password}
                    />
                    {
                        isLoginShown &&
                        (
                            <Text style={styles.forgotPassword}>{Texts.forgotPasswordLink}</Text>
                        )
                    }
                </View>
                <FooterTextButtonBlock
                    submitLabel={isLoginShown && 'Submit' || 'Next'}
                    onBackPress={this.props.navigation.goBack.bind(this, null)}
                    onSubmitPress={this.signIn.bind(this)}
                />
            </View>
        );
    }

    render() {
        return ( // repeat height: this.state.screenHeight in render to rerender view when state changes
            <Image
                style={[styles.backgroundImage, { height: this.state.screenHeight }]}
                source={require('../../../images/sw-back.png')}
            >
                {
                    (this.state.isLoginShown || this.state.activeStep === 0)
                    && // LOGIN FORM
                    (
                        this.renderLoginForm()
                    )
                    || //SIGN UP FORM (2 step)
                    (
                        <View style={[styles.signupSecondForm, { height: this.state.secondFormHeight }]}>
                            <ScrollView ref={sv => this.references.scrollView = sv}>
                                <View style={[styles.secondInnerForm]}>
                                    <View style={styles.formHead}>
                                        <Text style={styles.title}>YOUR PROFILE</Text>
                                        <Text style={styles.forgotPassword}>{Texts.profileFormDescription}</Text>
                                        <View style={styles.progressBar}>
                                            <View style={styles.inactive}></View>
                                            <View style={styles.active}></View>
                                        </View>
                                    </View>
                                    <ValidatedStyledInput
                                        label={Texts.firstNameLabel}
                                        placeholder={Texts.firstNamePlaceholder}
                                        onChangeText={this.setValue.bind(this, 'firstName')}
                                        value={this.state.firstName}
                                        styles={{ height: 50 }}
                                    />
                                    <ValidatedStyledInput
                                        label={Texts.lastNameLabel}
                                        placeholder={Texts.lastNamePlaceholder}
                                        onChangeText={this.setValue.bind(this, 'lastName')}
                                        value={this.state.lastName}
                                        styles={{ height: 50 }}
                                    />
                                    <ValidatedStyledInput
                                        label={Texts.usernameLabel}
                                        placeholder={Texts.usernamePlaceholder}
                                        onChangeText={this.setValue.bind(this, 'username')}
                                        value={this.state.username}
                                        styles={{ height: 50 }}
                                    />
                                </View>
                            </ScrollView>
                            <FooterTextButtonBlock
                                submitLabel={'Submit'}
                                onBackPress={this.returnToPreviousStep.bind(this)}
                                onSubmitPress={this.checkInfoBeforeSignup.bind(this)}
                            />
                        </View>
                    )
                }
            </Image>
        )
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        alignSelf: 'stretch',
        width: null,
        justifyContent: 'center',
    },
    form: {
        // height: this.state.formHeight,
        backgroundColor: Colors.mainWhite,
    },
    innerForm: {
        marginLeft: 33,
        marginRight: 33,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.fontBlack,
    },
    forgotPassword: {
        fontSize: 14,
        color: Colors.fontGrey,
    },
    progressBar: {
        height: 2,
        backgroundColor: Colors.divider,
        flexDirection: 'row',
    },
    active: {
        flex: 1,
        height: 3,
        backgroundColor: Colors.mainOrange,
    },
    inactive: {
        flex: 1,
    },
    signupSecondForm: {
        // height: 412,
        backgroundColor: Colors.mainWhite,
    },
    secondInnerForm: {
        height: 357,
        justifyContent: 'space-between',
        marginLeft: 33,
        marginRight: 33,
        paddingTop: 32,
        paddingBottom: 32,
    },
    formHead: {
        justifyContent: 'space-between',
        height: 88,
    }
});

function mapStateToProps (store) {
    return { enterWay: store.user.enterWay };
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({signupUser, signinUser, setCurrentTab}, dispatch)
}

export const Signup = connect(mapStateToProps, mapDispatchToProps)(_Signup);
