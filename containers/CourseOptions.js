import React, {Component} from 'react';
import {Image, StyleSheet, Dimensions, Alert} from 'react-native';
import {connect} from 'react-redux';
import {
    Container,
    Header,
    Left,
    Body,
    Grid,
    Col,
    Right,
    Content,
    H3,
    Title,
    Text,
    InputGroup,
    Input,
    Button,
    Icon,
    View
} from 'native-base';
import {bindActionCreators} from 'redux';
import LinearGradient from 'react-native-linear-gradient';

import {submitCourseNumber} from '../actions';
import SIGNUP from '../actions/types';
import {fetchCourse} from '../actions/index';

const deviceHeight = Dimensions.get('window').height;

class _CourseOptions extends Component {
    static navigationOptions = {
        header: ({state}) => ({
            visible: false,
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            course: ''
        };
        this.sendCourseNumber = this.sendCourseNumber.bind(this)
    }

    sendCourseNumber() {
        const {course} = this.state
        const {navigate} = this.props.navigation

        if (course.length > 0) {
            this.props.fetchCourse(course);
            navigate('Signup')
        } else {
            Alert.alert(
                'Error',
                'Please enter a valid course number'
            )
        }

    }

    render() {
        const {navigate} = this.props.navigation
        return (
            <LinearGradient colors={['#00C9FF', '#92FE9D']} style={styles.linearGradient}>
                <Container>
                    <Header hasTabs
                            style={{
                                backgroundColor: 'transparent',
                                borderWidth: 0,
                                borderColor: 'transparent',
                                elevation: 0
                            }}>
                        <Left>
                            <Button transparent
                                    onPress={() => this.props.navigation.goBack(null)}>
                                <Icon name='ios-arrow-back'/>
                            </Button>
                        </Left>
                        <Body/>
                        <Right/>
                    </Header>
                    <Content>
                        <Image style={styles.shadow}>
                            <View style={styles.bg}>
                                <H3>
                                    If you have a course number, enter it here
                                </H3>
                                <InputGroup style={styles.input}>
                                    <Input placeholder="COURSE NUMBER"
                                           onChangeText={course => this.setState({course})}/>
                                </InputGroup>
                                <Button
                                    style={styles.btn}
                                    onPress={this.sendCourseNumber}>
                                    <Text>Submit</Text>
                                </Button>
                                <Title style={{paddingTop: 15}}>
                                    Or
                                </Title>
                                <Button
                                    style={styles.btn}
                                    onPress={() => navigate('Signup')}>
                                    <Text>Browse courses</Text>
                                </Button>
                            </View>
                        </Image>
                    </Content>
                </Container>
            </LinearGradient>
        )
    }

}

const styles = {
    linearGradient: {
        flex: 1
    },
    header: {
        marginTop: 5
    },
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        flex: 1
    },
    shadow: {
        flex: 1,
        width: null,
        height: null,
    },
    bg: {
        flex: 1,
        margin: 10,
        marginTop: deviceHeight / 4,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 30,
        bottom: 0,
    },
    input: {
        marginBottom: 20,
    },
    btn: {
        marginTop: 20,
        alignSelf: 'center',
    },
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({fetchCourse: fetchCourse}, dispatch)
}

export const CourseOptions = connect(null, mapDispatchToProps)(_CourseOptions);