import React, { Component } from 'react';
import {
    View,
    ScrollView,
    TextInput,
    StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Tabs from '../../components/Tabs';
import { setCurrentTab } from '../../actions/index';
import Colors from '../../styles/colors';
import InnerTabs from '../../components/InnerTabs';
import CoursesCatalog from './components/CoursesCatalog';
import { getCourses } from '../../actions/index';

class _Discover extends Component {
    static navigationOptions = {
        title: 'Discover',
        header: ({ state }) => ({
            visible: false,
        })
    };

    constructor (props) {
        super(props);

        this.state = {
            search: '',
            currentTab: 0,
        };

        props.getCourses();
    }

    showTab (i) {
        this.setState({ currentTab: i });
    }

    render () {
        const tabs = [
            {
                label: 'Lessons',
                onPress: this.showTab.bind(this)
            },
            {
                label: 'Courses',
                onPress: this.showTab.bind(this)
            }
        ];

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.search}>
                        <TextInput
                            value={this.state.search}
                            onChangeText={(value) => {this.setState({search: value})}}
                            style={styles.searchInput}
                        />
                    </View>
                </View>
                <View>
                    <InnerTabs tabs={tabs} currentTab={this.state.currentTab}/>
                </View>
                <ScrollView style={styles.content}>
                    {
                        (
                            (tabs[this.state.currentTab].label === 'Courses') &&
                            (
                                <CoursesCatalog courses={this.props.courses} navigation={this.props.navigation}/>
                            )
                        )
                    }
                </ScrollView>
                <Tabs
                    navigation={this.props.navigation}
                    currentTab={this.props.currentTab}
                    setCurrentTab={this.props.setCurrentTab}
                />
            </View>
        )
    }
}

_Discover.propTypes = {
    currentTab: PropTypes.string,
    setCurrentTab: PropTypes.func,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: Colors.mainWhite,
        height: 76,
        justifyContent: 'flex-end',
    },
    search: {
        height: 44,
        backgroundColor: Colors.lightGrey,
        paddingTop: 7,
        paddingRight: 8,
        paddingBottom: 7,
        paddingLeft: 8,
    },
    searchInput: {
        height: 30,
        backgroundColor: Colors.mainWhite,
        borderRadius: 5,
    },
    innerTabs: {

    },
    content: {
        marginBottom: 50,
    },
});

function mapStateToProps (store) {
    return {
        currentTab: store.user.currentTab,
        courses: store.coursesList.courses,
    };
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({ setCurrentTab, getCourses }, dispatch)
}

export const Discover = connect(mapStateToProps, mapDispatchToProps)(_Discover);
