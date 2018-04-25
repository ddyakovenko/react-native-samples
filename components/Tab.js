import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Icon } from 'native-base';
import { View, TouchableWithoutFeedback } from 'react-native';
import Colors from '../styles/colors';

export default class Tab extends Component {
    goTo () {
        this.props.navigation.navigate(this.props.tabName);
        this.props.setCurrentTab(this.props.tabName);
    }

    render () {
        const { label, iconName, tabName, currentTab } = this.props;
        return (
            <TouchableWithoutFeedback onPress={this.goTo.bind(this)}>
                <View style={styles.button}>
                    <Icon
                        name={iconName}
                        style={Object.assign({}, styles.icon, currentTab === tabName && styles.activeText || {})}
                    />
                    <Text style={Object.assign({}, styles.text, currentTab === tabName && styles.activeText || {})}>
                        {label}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

Tab.propTypes = {
    iconName: PropTypes.string,
    label: PropTypes.string,
    navigation: PropTypes.object,
    currentTab: PropTypes.string,
    tabName: PropTypes.string,
    setCurrentTab: PropTypes.func,
};

const styles = {
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: Colors.fontBlack,
        fontSize: 10,
    },
    icon: {
        color: Colors.fontBlack,
        fontSize: 30,
    },
    activeText: {
        color: Colors.mainOrange,
    },
};
