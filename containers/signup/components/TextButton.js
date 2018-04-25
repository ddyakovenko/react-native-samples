import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableWithoutFeedback, View, Text, Dimensions } from 'react-native';
import Colors from '../../../styles/colors';

export default class TextButton extends Component {
    render () {
        return (
            <TouchableWithoutFeedback
                onPress={this.props.onPress}
            >
                <View style={styles.button}>
                    <Text style={{...styles.text, color: this.props.color || Colors.mainOrange}}>
                        {this.props.label}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

TextButton.propTypes = {
    label: PropTypes.string,
    onPress: PropTypes.func,
    color: PropTypes.string,
};

const styles = {
    button: {
        height: 55,
        justifyContent: 'center',
        width: 100,
        flexDirection: 'column',
        alignItems: 'center',
    },
    text: {
        height: 28,
        fontSize: 24,
    }
};
