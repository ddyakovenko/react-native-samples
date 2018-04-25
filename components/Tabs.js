import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tab from './Tab';
import { StyleSheet, View, Dimensions } from 'react-native';
import TabsConfig from '../config/tabs';
import Colors from '../styles/colors';

const windowWidth = Dimensions.get('window').width;

export default class Tabs extends Component {
    render () {
        const { navigation, currentTab, setCurrentTab } = this.props;
        return (
            <View style={styles.wrapper}>
                {
                    TabsConfig.map((tab, i) => {
                        return (
                            <Tab
                                key={i}
                                iconName={tab.iconName}
                                label={tab.label}
                                navigation={navigation}
                                currentTab={currentTab}
                                tabName={tab.tabName}
                                setCurrentTab={setCurrentTab}
                            />
                        );
                    })
                }
            </View>
        );
    }
}

Tabs.propTypes = {
    navigation: PropTypes.object,
    currentTab: PropTypes.string,
    setCurrentTab: PropTypes.func,
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: windowWidth,
        height: 50,
        flexDirection: 'row',
        backgroundColor: Colors.back,
    }
});
