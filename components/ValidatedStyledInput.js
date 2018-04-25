import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Dimensions, StyleSheet, TextInput } from 'react-native';
import Colors from '../styles/colors';

const deviceWidth = Dimensions.get('window').width;

export default class ValidatedStyledInput extends Component {
    render () {
        const { label, onChangeText, keyboardType, value, placeholder, secureTextEntry } = this.props;

        return (
            <View style={[styles.inputWrapper, this.props.styles]}>
                <Text style={styles.inputLabel}>{label}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    keyboardType={keyboardType || 'default'}
                    onChangeText={onChangeText}
                    value={value}
                    secureTextEntry={secureTextEntry || false}
                />
            </View>
        );
    }
}

ValidatedStyledInput.propTypes = {
    label: PropTypes.string,
    onChangeText: PropTypes.func,
    styles: PropTypes.object,
    keyboardType: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    secureTextEntry: PropTypes.bool,
};

const styles = StyleSheet.create({
    inputWrapper: {
        height: 60,
        justifyContent: 'space-between',
    },
    inputLabel: {
        height: 21,
        fontSize: 18,
        color: Colors.fontBlack,
    },
    input: {
        height: 28,
        color: Colors.fontBlack,
        fontSize: 24,
    },
});
