//page for single course details

import React, {Component} from 'react';
import {
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Keyboard,
    LayoutAnimation
} from 'react-native';
import {
    Container,
    Header,
    Title,
    Grid,
    Col,
    Row,
    Card,
    CardItem,
    Content,
    Left,
    Body,
    Right,
    Text,
    Tabs,
    Tab,
    H1,
    H2,
    H3,
    List,
    ListItem,
    Footer,
    FooterTab,
    Button,
    Icon
} from 'native-base';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {StackNavigator} from 'react-navigation';
import * as Progress from 'react-native-progress';
import RNFetchBlob from 'react-native-fetch-blob';
import MusicControl from 'react-native-music-control';

import {downloadAudio} from '../actions/api';
import {pauseSession, playFile, setCurrentProgress, setPlayList} from '../actions/play';

class _CoursePage extends Component {
    static navigationOptions = {
        tabBar: ({state}) => ({
            visible: false
        }),
        header: ({state}) => ({
            visible: false,
        })
    };

    constructor() {
        super();

        this.state = {
            sections: [],
            expanded: {}
        };

        this.renderModule = this.renderModule.bind(this);
        this.playSection = this.playSection.bind(this);
        this.renderIcon = this.renderIcon.bind(this);
        this.renderContent = this.renderContent.bind(this);
    }

    componentDidMount() {
        MusicControl.enableBackgroundMode(true);
        MusicControl.on('play', this.playSection);
        MusicControl.on('pause', this.pauseSection);

        const course = this.props.currentCourse;
        const sections = course.modules.map(module => {
            return module.sections.map(section => section.section_id);
        }).reduce((accu, val) => accu.concat(val), []);

        const expanded = sections.reduce((accu, val) => {
            accu[val] = false;
            return accu;
        }, {});

        this.setState({
            sections,
            expanded
        })
    }

    playSection(section) {
        const {navigate} = this.props.navigation;
        const course = this.props.currentCourse;

        let sections = course.modules.map(module => {
            return module.sections;
        }).reduce((accu, val) => accu.concat(val), []);

        const currentIndex = this.state.sections.indexOf(section.section_id);
        sections = sections.slice(currentIndex); //remaining unplayed sections
        const sectionArray = sections.map(section => ({
            section,
            filePath: this.props.files[section.section_id],
            currentProgress: this.props.currentProgress[section.section_id]
        }));

        this.props.setPlayList(sectionArray);
        const sectionInfo = sectionArray[0];

        if (this.props.sectionPlaying) { //if something is playing, pause that first
            this.props.pauseSession(this.props.sectionPlaying);
        }
        this.props.playFile(sectionInfo, sectionArray);
        navigate('Player', {section, sectionArray});
    }

    pauseSection(section) {

    }

    renderIcon(section) { //render download, play, pause icons in the list items
        const sectionInfo = {
            url: section.section_url,
            id: section.section_id
        };

        if (!this.props.isDownloading[section.section_id] && !this.props.files[section.section_id]) {
            return (
                <Button transparent
                        onPress={() => this.props.downloadAudio([sectionInfo])}>
                    <Icon name='ios-cloud-download-outline'/>
                </Button>
            )
        } else if (this.props.isDownloading[section.section_id] && !this.props.files[section.section_id]) {
            return (
                <Progress.Circle showText={true} progress={this.props.downloadProgress[section.section_id]} size={20}/>
            )
        } else if (this.props.files[section.section_id] && !this.props.playing[section.section_id]) {
            return (
                <Button transparent
                        onPress={() => this.playSection(section)}>
                    <Icon name='md-arrow-dropright-circle'/>
                </Button>
            )
        } else if (this.props.files[section.section_id] && this.props.playing[section.section_id]) {
            return (
                <Button transparent
                        onPress={() => this.props.pauseSession(section)}>
                    <Icon name='ios-pause'/>
                </Button>
            )
        }
    }

    renderContent(section) { //expand and contract section details
        const expand = Object.assign({}, this.state.expanded, {[section.section_id]: true});
        const contract = Object.assign({}, this.state.expanded, {[section.section_id]: false});

        if (!this.state.expanded[section.section_id]) {
            return (
                <Button iconRight transparent small onPress={() => this.setState({expanded: expand})}>
                    <Text>More</Text>
                    <Icon name='arrow-down'/>
                </Button>
            )
        } else {
            return (
                <View>
                    <Text note>{section.content}</Text>
                    <Button iconRight transparent small onPress={() => this.setState({expanded: contract})}>
                        <Text>Less</Text>
                        <Icon name='arrow-up'/>
                    </Button>
                </View>
            )
        }

    }

    renderModule(module, j) {
        const {navigate} = this.props.navigation;
        const course = this.props.currentCourse;

        return (
            <View key={j}>
                <ListItem itemDivider>
                    <Text>{module.module_title}</Text>
                </ListItem>

                {module.sections.map((section, i) => {
                    const number = this.state.sections.indexOf(section.section_id) + 1
                    return (
                        <ListItem key={i} style={{}}>
                            <Text>{number}</Text>
                            <Body>
                            <Text>{`${section.title} (${section.run_time})`}</Text>
                            {this.renderContent(section)}
                            </Body>
                            <Right>
                                {this.renderIcon(section)}
                            </Right>
                        </ListItem>
                    )
                })
                }
            </View>
        )
    }

    render() {
        const {name, email} = this.props.user;
        const course = this.props.currentCourse;
        const {navigate} = this.props.navigation;
        const course_img = RNFetchBlob.fs.dirs.DocumentDir + '/images/' + course.id + '/course_img.png'

        let run_time = '';

        if (course.run_time) {
            const rt_hour = Math.floor(course.run_time / 3600);
            const rt_min = Math.floor(course.run_time / 60 - rt_hour * 60);
            const rt_sec = course.run_time % 60;
            run_time = rt_hour > 0 ? `${rt_hour}h ${rt_min}m` : `${rt_min}m`
        }

        return (
            <Image
                style={{width: null, height: null, flex: 1, resizeMode: 'cover'}}
                source={{uri: course.img_url_mobile}}
                blurRadius={20}
            >
                <Container>
                    <Header style={{backgroundColor: 'transparent'}}>
                        <Left>
                            <Button transparent
                                    onPress={() => this.props.navigation.goBack(null)}>
                                <Icon name='arrow-back'/>
                                <Text>My Courses</Text>
                            </Button>
                        </Left>
                    </Header>
                    <Content>
                        <Grid style={{marginBottom: 10}}>
                            <Col size={35} style={{margin: 5, marginLeft: 15, marginRight: 10}}>
                                <Image
                                    style={{width: 130, height: 130}}
                                    source={{uri: course.img_url_mobile}}
                                    // source ={course_img==null ? {uri: course.img_url} : {uri: course_img} }
                                />
                            </Col>
                            <Col size={65} style={{margin: 10}}>
                                <H2 style={{marginBottom: 10}}>{course.name}</H2>
                                <Text>{`by ${course.teacher}`}</Text>

                                <Text style={{fontSize: 11, marginTop: 5}}>
                                    <Icon name='ios-clock-outline' style={{fontSize: 11}}/>
                                    {` ${run_time}`}
                                </Text>
                            </Col>
                        </Grid>
                        <Tabs initialPage={1}>
                            <Tab heading='Description' textStyle={{fontSize: 13}} activeTextStyle={{fontSize: 13}}>
                                <Card>
                                    <CardItem>
                                        <Body>
                                        <Text>{course.description}</Text>
                                        </Body>
                                    </CardItem>
                                </Card>
                            </Tab>
                            <Tab heading='Content' textStyle={{fontSize: 13}} activeTextStyle={{fontSize: 13}}>
                                {course['modules']
                                    .map((module, i) => {
                                        return this.renderModule(module, i)
                                    })
                                }
                            </Tab>
                            <Tab heading='Discussion' textStyle={{fontSize: 13}} activeTextStyle={{fontSize: 13}}>
                            </Tab>
                            <Tab heading='Assignment' textStyle={{fontSize: 13}} activeTextStyle={{fontSize: 13}}>
                            </Tab>
                        </Tabs>
                    </Content>
                </Container>
            </Image>
        )
    }
}

const mapStateToProps = state => {
    const user = state.user;
    const {userCourses, currentCourse} = state.currentCourses;
    const {isDownloading, downloadProgress, files} = state.audioPaths;
    const {playing, sectionPlaying, currentProgress} = state.playerState;

    return {
        user,
        userCourses,
        currentCourse,
        isDownloading,
        downloadProgress,
        files,
        playing,
        sectionPlaying,
        currentProgress
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({downloadAudio, pauseSession, playFile, setCurrentProgress, setPlayList}, dispatch)
}

export const CoursePage = connect(mapStateToProps, mapDispatchToProps)(_CoursePage);
