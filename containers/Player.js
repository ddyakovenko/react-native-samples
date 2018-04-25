// Modal for audio player

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
    Slider
} from 'react-native';
import {
    Container,
    Segment,
    Picker,
    Header,
    Card,
    CardItem,
    Thumbnail,
    Title,
    Content,
    Left,
    Body,
    Right,
    Text,
    H2,
    H3,
    List,
    ListItem,
    Footer,
    FooterTab,
    Button,
    Icon
} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {StackNavigator} from 'react-navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Progress from 'react-native-progress';
// import Slider from 'react-native-slider';
import RNFetchBlob from 'react-native-fetch-blob';
import MusicControl from 'react-native-music-control';

import {pauseSession, getPlayProgress, resumePlaying, changePlaySpeed, setCurrentProgress} from '../actions/play';

const Item = Picker.Item;

class _Player extends Component {
    static navigationOptions = {
        tabBar: ({state}) => ({
            visible: false
        }),
        header: ({state}) => ({
            visible: false,
        }),
        mode: 'modal'
    };

    constructor() {
        super();

        this.state = {
            playSpeed: '1',
            teacher_img: '',
            course_img: ''
        };

        this.playOrPause = this.playOrPause.bind(this);
        this.speedPicker = this.speedPicker.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.playSection = this.playSection.bind(this);
        this.pauseSection = this.pauseSection.bind(this);
    }

    componentDidMount() {
        MusicControl.enableBackgroundMode(true);
        MusicControl.on('play', this.playSection);
        MusicControl.on('pause', this.pauseSection);

        interval = setInterval(this.getProgress.bind(this), 1000);

        this.setState({
            teacher_img: RNFetchBlob.fs.dirs.DocumentDir + '/images/' + this.props.currentCourse.id + '/teacher_img.png',
            course_img: RNFetchBlob.fs.dirs.DocumentDir + '/images/' + this.props.currentCourse.id + '/course_img.png'
        });
    }

    playSection() {
        const section = this.props.sectionPlaying;
        const sectionArray = this.props.currentPlayList;
        interval = setInterval(this.getProgress.bind(this), 1000);

        this.props.resumePlaying(sectionArray[0], sectionArray);

        MusicControl.setNowPlaying({
            title: section.title,
            artwork: this.state.course_img,
            artist: this.props.currentCourse.teacher,
            album: this.props.currentCourse.name,
            duration: this.props.duration
        });
        MusicControl.enableControl('play', false);
        MusicControl.enableControl('pause', true);
    }

    pauseSection() {
        const section = this.props.sectionPlaying;
        clearInterval(interval);
        this.props.pauseSession(section);

        MusicControl.enableControl('play', false);
        MusicControl.enableControl('pause', true);
    }

    getProgress() {
        const section = this.props.sectionPlaying;
        this.props.getPlayProgress(section);
    }

    playOrPause() {
        const section = this.props.sectionPlaying;
        const sectionArray = this.props.currentPlayList;

        if (this.props.playing[section.section_id] === true) {
            return (
                <Button transparent onPress={this.pauseSection}
                        style={{marginLeft: 5, marginRight: 5}}>
                    <Icon name='ios-pause'
                          style={{fontSize: 50, color: '#FFA000'}}/>
                </Button>
            )
        } else if (this.props.paused[section.section_id] === true || this.props.completed[section.section_id] === true) {
            return (
                <Button transparent onPress={this.playSection}
                        style={{marginLeft: 5, marginRight: 5}}>
                    <Icon name='ios-play'
                          style={{fontSize: 50, color: '#FFA000'}}/>
                </Button>
            )
        }
    }

    onSpeedChange(value) {
        this.props.changePlaySpeed(value)
    }

    speedPicker() {
        return (
            <Col style={{
                width: 70,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                alignItems: 'center'
            }}>
                <Picker style={{padding: 0, margin: 0, height: 20}}
                        iosHeader='Select Speed'
                        mode='dropdown'
                        selectedValue={this.props.playSpeed}
                        onValueChange={this.onSpeedChange.bind(this)}>
                    <Item label='0.75x' value='0.75'/>
                    <Item label='1x' value='1'/>
                    <Item label='1.25x' value='1.25'/>
                    <Item label='1.5x' value='1.5'/>
                    <Item label='2x' value='2'/>
                    <Item label='2.5x' value='2.5'/>
                </Picker>
                <Text note>Speed</Text>
            </Col>
        )
    }

    render() {
        const course = this.props.currentCourse;
        const section = this.props.sectionPlaying;
        const length = this.props.duration;
        const currentProgress = this.props.currentProgress[section.section_id];
        const minPlayed = Math.max(Math.floor(this.props.currentProgress[section.section_id] / 60), 0);
        const secPlayed = Math.max(Math.floor(this.props.currentProgress[section.section_id] % 60), 0);
        const minRemain = Math.floor((length - this.props.currentProgress[section.section_id]) / 60);
        const secRemain = Math.floor((length - this.props.currentProgress[section.section_id]) % 60);

        return (
            <Image
                style={{width: null, height: null, flex: 1, resizeMode: 'cover'}}
                source={{uri: course.img_url_mobile}}
                blurRadius={20}
            >
                <Container>
                    <Header style={{backgroundColor: 'transparent'}}>
                        <Grid>
                            <Col style={{width: 50}}>
                                <Left>
                                    <Button transparent
                                            onPress={() => this.props.navigation.goBack(null)}>
                                        <Icon name='ios-close'/>
                                    </Button>
                                </Left>
                            </Col>
                            <Col style={{flexDirection: 'column', justifyContent: 'center'}}>
                                <Title>{course.name}</Title>
                            </Col>
                        </Grid>
                    </Header>
                    <Content>
                        <Card style={{flex: 1}}>
                            <CardItem>
                                <Left>
                                    <Thumbnail source={{uri: course.teacher_img}}/>
                                    <Body>
                                    <Text>{section.title}</Text>
                                    <Text note>{course.teacher}</Text>
                                    </Body>
                                </Left>
                            </CardItem>
                            <Grid>
                                <Col style={{width: 30}}>
                                </Col>
                                <Col size={1} style={{height: 35, marginTop: 5}}>
                                    <Button light
                                            style={{width: 100, height: 40, padding: 0, justifyContent: 'center'}}>
                                        <Text>Q&A</Text>
                                    </Button>
                                </Col>
                                <Col size={1} style={{height: 35, marginTop: 5}}>
                                    <Button light
                                            style={{width: 100, height: 40, padding: 0, justifyContent: 'center'}}>
                                        <Text style={{textAlign: 'center'}}>Notes</Text>
                                    </Button>
                                </Col>
                                <Col size={1} style={{height: 35, marginTop: 5}}>
                                    <Button light
                                            style={{width: 100, height: 40, padding: 0, justifyContent: 'center'}}>
                                        <Text>Resources</Text>
                                    </Button>
                                </Col>
                                <Col style={{width: 30}}>
                                </Col>
                            </Grid>
                            <CardItem cardBody>
                                <Image style={{resizeMode: 'contain', height: 330, width: 330, flex: 1}}
                                       source={{uri: course.img_url_mobile}}/>
                            </CardItem>
                            <Grid>
                                {this.speedPicker()}
                                <Col
                                    size={2} style={{height: 70, marginTop: 5}}>
                                    <Button transparent
                                            onPress={() => this.props.setCurrentProgress(currentProgress - 30)}>
                                        <MaterialIcons name='replay-30'
                                                       style={{fontSize: 40, textAlign: 'center', color: '#FFA000'}}/>
                                    </Button>
                                </Col>
                                <Col
                                    size={2}
                                    style={{height: 70, marginTop: 5, flexDirection: 'row', justifyContent: 'center'}}>
                                    {this.playOrPause()}
                                </Col>
                                <Col size={2} style={{
                                    height: 70,
                                    marginTop: 5,
                                    marginRight: 0,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end'
                                }}>
                                    <Button transparent
                                            onPress={() => this.props.setCurrentProgress(currentProgress + 30)}
                                            style={{marginRight: 0}}>
                                        <MaterialIcons name='forward-30'
                                                       style={{fontSize: 40, textAlign: 'center', color: '#FFA000'}}/>
                                    </Button>
                                </Col>
                                <Col style={{
                                    width: 70,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Button transparent style={{height: 60, padding: 0, marginTop: 0}}>
                                        <Grid>
                                            <Row
                                                style={{justifyContent: 'center'}}>
                                                <Icon name='ios-list'
                                                      style={{fontSize: 30, marginTop: 5, color: 'black'}}/>
                                            </Row>
                                            <Row
                                                style={{justifyContent: 'center'}}>
                                                <Text note>Sections</Text>
                                            </Row>
                                        </Grid>
                                    </Button>

                                </Col>
                            </Grid>
                            <Grid>
                                <Col style={{width: 70}}>
                                    <Text note
                                          style={{marginLeft: 20}}>{`${('0' + minPlayed).slice(-2)}: ${('0' + secPlayed).slice(-2)}`}</Text>
                                </Col>
                                <Col>
                                </Col>
                                <Col style={{width: 70}}>
                                    <Text note
                                          style={{marginRight: 20}}>-{`${('0' + minRemain).slice(-2)}: ${('0' + secRemain).slice(-2)}`}</Text>
                                </Col>
                            </Grid>
                            <Slider
                                style={{height: 5, margin: 60, marginTop: 15}}
                                value={this.props.currentProgress[section.section_id] / length}
                                onSlidingComplete={(value) => this.props.setCurrentProgress(value * this.props.duration)}
                                trackStyle={sliderStyle.track}
                                thumbStyle={sliderStyle.thumb}
                                minimumTrackTintColor='#FFA726'
                            />
                        </Card>
                    </Content>
                </Container>
            </Image>
        )
    }
}


var sliderStyle = StyleSheet.create({
    track: {
        height: 7,
        borderRadius: 4,
        backgroundColor: 'white',
        shadowColor: 'white',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 1,
        shadowOpacity: 0.15,
    },
    thumb: {
        width: 20,
        height: 20,
        backgroundColor: '#FFE0B2',
        borderColor: '#E64A19',
        borderWidth: 5,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 2,
        shadowOpacity: 0.35,
    }
})

const mapStateToProps = state => {
    const user = state.user;
    const {currentCourse} = state.currentCourses;
    const {files} = state.audioPaths;
    const {playing, paused, completed, duration, sectionPlaying, currentProgress, playSpeed, currentPlayList} = state.playerState;

    return {
        user,
        currentCourse,
        files,
        playing,
        paused,
        completed,
        duration,
        sectionPlaying,
        currentProgress,
        playSpeed,
        currentPlayList
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        pauseSession,
        resumePlaying,
        getPlayProgress,
        changePlaySpeed,
        setCurrentProgress
    }, dispatch)
}

export const Player = connect(mapStateToProps, mapDispatchToProps)(_Player)