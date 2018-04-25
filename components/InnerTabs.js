import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Dimensions, Text, TouchableWithoutFeedback } from 'react-native';
import Colors from '../styles/colors';

const windowWidth = Dimensions.get('window').width;

export default class InnerTabs extends Component {
    render () {
        const { tabs, currentTab } = this.props;
        return (
            <View style={styles.tabs}>
                {
                    tabs.map((tab, i) => {
                        return (
                            <TouchableWithoutFeedback onPress={() => {tab.onPress(i)}} key={i}>
                                <View style={[styles.tab, currentTab === i && styles.active || styles.inactive]}>
                                    <Text style={[styles.text, currentTab === i && styles.activeText || styles.inactiveText]}>
                                        {tab.label}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        );
                    })
                }
            </View>
        );
    }
}

InnerTabs.propTypes = {
    currentTab: PropTypes.number,
    tabs: PropTypes.array,
};

const styles = StyleSheet.create({
    tabs: {
        width: windowWidth,
        flexDirection: 'row',
        backgroundColor: Colors.mainWhite,
        height: 40,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        borderBottomColor: Colors.mainOrange,
        borderBottomWidth: 3,
    },
    inactive: {
        borderBottomColor: Colors.transparentDivider,
        borderBottomWidth: 2,
    },
    text: {
        fontSize: 16,
    },
    activeText: {
        color: Colors.mainOrange,
    },
    inactiveText: {
        color: Colors.fontGrey,
    }
});
