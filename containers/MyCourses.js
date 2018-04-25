import React, {Component} from 'react';
import {
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Keyboard,
    LayoutAnimation,
    StyleSheet,
} from 'react-native';
import * as firebase from "firebase";
import {
    Container,
    Title,
    Content,
    Left,
    Right,
    Thumbnail,
    Body,
    Text,
    H1,
    H2,
    H3,
    List,
    ListItem,
    Footer,
    FooterTab,
    Button,
    Icon,
    Grid,
    Col
} from 'native-base';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import I18n from 'react-native-i18n';
import {StackNavigator, TabNavigator} from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import Tabs from '../components/Tabs';
import {setCurrentTab} from '../actions/index';

import {setCurrentCourse, loadUserCourses} from '../actions/index';
import {downloadAudio} from '../actions/api';

class _MyCourses extends Component {
    static navigationOptions = {
        title: 'My Courses',
        tabBar: ({state}) => ({
            visible: false
        }),
        header: (navigation, defaultHeader) => ({
            ...defaultHeader,
            visible: false,
        })
    };

    constructor() {
        super();

        this.goToCourse = this.goToCourse.bind(this);
        this.downloadCourse = this.downloadCourse.bind(this);
        this.checkIfDownloadComplete = this.checkIfDownloadComplete.bind(this);
        this.downloadOrPlay = this.downloadOrPlay.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        const that = this;

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                const userId = user.uid;

                firebase.database().ref('users/' + userId + '/courses')
                    .once('value')
                    .then(snapshot => {
                        that.props.loadUserCourses(snapshot.val())
                    })
            }
        })
    }

    goToCourse(course) {
        const {navigate} = this.props.navigation;

        navigate('PlayerNavigator');
        this.props.setCurrentCourse(course);
    }

    downloadCourse(course) {
        const sections = course.modules.map(module => module.sections)
            .reduce((accu, val) => accu.concat(val), []);

        this.props.downloadAudio(sections);
        const {navigate} = this.props.navigation;
        this.props.setCurrentCourse(course);
        navigate('PlayerNavigator');
    }

    checkIfDownloadComplete(course) {
        const sections = course.modules.map(module => {
            return module.sections.map(section => section.section_id)
        }).reduce((accu, val) => accu.concat(val), []);

        const files = this.props.files;

        return sections.every(section => !!files[section]); //check if every section already exists in sandbox
    }

    downloadOrPlay(course) {
        const downloaded = this.checkIfDownloadComplete(course);

        if (downloaded) {
            return (
                <Button transparent small
                        onPress={() => this.goToCourse(course)}>
                    <Icon name='ios-arrow-forward'/>
                </Button>
            )
        } else {
            return (
                <Button transparent small onPress={() => this.downloadCourse(course)}>
                    <Text style={{}}>
                        Download
                    </Text>
                </Button>
            )
        }
    }

    render() {
        let {name, email} = this.props.user;
        if (!name) {
            name = '';
        }

        const {navigate} = this.props.navigation;
        const courses = this.props.userCourses;
        const courseArr = [];

        for (var key in courses) {
            courseArr.push(courses[key]);
        }

        return (

            <View style={styles.container}>
                <Tabs
                    navigation={this.props.navigation}
                    currentTab={this.props.currentTab}
                    setCurrentTab={this.props.setCurrentTab}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

function mapStateToProps(store) {
    const user = store.user;
    const {currentCourse, userCourses} = store.currentCourses;
    const {files} = store.audioPaths;
    return {
        user,
        userCourses,
        currentCourse,
        files,
        currentTab: store.user.currentTab,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({setCurrentCourse, loadUserCourses, downloadAudio, setCurrentTab}, dispatch)
}

export const MyCourses = connect(mapStateToProps, mapDispatchToProps)(_MyCourses);
