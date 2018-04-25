import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Colors from '../../../styles/colors';
import TextButton from './TextButton';

export default class FooterTextButtonBlock extends Component {
    render () {
        return (
            <View style={styles.wrapper} >
                <TextButton
                    label="Back"
                    onPress={this.props.onBackPress}
                    color={Colors.fontBlack}
                />
                <TextButton
                    label={this.props.submitLabel}
                    onPress={this.props.onSubmitPress}
                    color={Colors.mainOrange}
                />
            </View>
        );
    }
}

FooterTextButtonBlock.propTypes = {
    submitLabel: PropTypes.string,
    onBackPress: PropTypes.func,
    onSubmitPress: PropTypes.func,
};

const styles = {
    wrapper: {
        height: 56,
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: Colors.divider,
        flexDirection: 'row',
    }
};