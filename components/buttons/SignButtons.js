import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, View, Text, Dimensions } from 'react-native';
import Colors from '../../styles/colors';

const deviceWidth = Dimensions.get('window').width;

export class OrangeButton extends Component {
    render () {
        return (
            <TouchableHighlight
                onPress={this.props.onPress}
                style={styles.wrapper}
            >
                <View style={Object.assign({}, styles.button, styles.orangeButton)}>
                    <Text style={Object.assign({}, styles.text, styles.boldText)}>{this.props.label}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

OrangeButton.propTypes = {
    label: PropTypes.string,
    onPress: PropTypes.func,
};

export class FbButton extends Component {
    render () {
        return (
            <TouchableHighlight
                onPress={this.props.onPress}
                style={styles.wrapper}
            >
                <View style={Object.assign({}, styles.button, styles.fbButton)}>
                    <Text style={Object.assign({},
                        styles.text,
                        (this.props.isLogin && styles.loginText || styles.signupText)
                    )}>{this.props.label}</Text>
                    <Text style={Object.assign({}, styles.text, styles.boldText, styles.fbText)}>Facebook</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

FbButton.propTypes = {
    label: PropTypes.string,
    onPress: PropTypes.func,
    isLogin: PropTypes.bool,
};

export class SignButton extends Component {
    render () {
        return (
            <TouchableHighlight
                onPress={this.props.onPress}
                style={styles.wrapper}
            >
                <View style={Object.assign({}, styles.button, styles.transparentButton)}>
                    <Text style={Object.assign({},
                        styles.text,
                        (this.props.isLogin && styles.loginText || styles.signupText),
                        styles.orangeText
                    )}>
                        {this.props.label}
                    </Text>
                    <Text style={Object.assign({}, styles.text, styles.boldText, styles.emailText, styles.orangeText)}>
                        Email
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }
}

SignButton.propTypes = {
    label: PropTypes.string,
    onPress: PropTypes.func,
    isLogin: PropTypes.bool,
};

const styles = {
    wrapper: {
        marginLeft: 13,
        marginRight: 13,
        marginBottom: 18,
    },
    button: {
        width: deviceWidth - 26,
        height: 55,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    orangeButton: {
        backgroundColor: Colors.mainOrange,
    },
    fbButton: {
        backgroundColor: Colors.fbBlue,
    },
    transparentButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.mainOrange,
    },
    text: {
        color: Colors.mainWhite,
        width: 80,
        height: 24,
        fontSize: 20,
    },
    boldText: {
        fontWeight: 'bold',
    },
    fbText: {
        width: 100,
    },
    emailText: {
        width: 55,
    },
    signupText: {
        width: 120,
    },
    loginText: {
        width: 105,
    },
    orangeText: {
        color: Colors.mainOrange,
    },
};
