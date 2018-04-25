import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableWithoutFeedback, Text, Dimensions, Image, StyleSheet } from 'react-native';
import StarRating from 'react-native-star-rating';

import Colors from '../../../styles/colors';

const _windowWidth = Dimensions.get('window').width;

export default class CourseCard extends Component {
    constructor (props) {
        super(props);

        this.references = {};
        this._imageHeight = 0;
        this._contentHeight = 0;
    }
    goToCourse (id) {
        this.props.navigation.navigate('Course');
    }

    onLayout (prop, layout) {
        this[prop] = layout.height;
        const { height, setMaxHeightCallback } = this.props;
        if (this._imageHeight + this._contentHeight + 30 > height) {
            setMaxHeightCallback(this._imageHeight + this._contentHeight + 30);
        }
    }

    render () {

        const { course, height } = this.props;
        const _hours = Math.floor(course.run_time / 3600);
        const _minutes = Math.floor(course.run_time / 60) - _hours * 60;
        const courseLength = `${_hours}h ${_minutes}m`;
        return (
            <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[styles.slide, {height: height}]}>
                    <View
                        style={styles.courseImage}
                    >
                        <Image
                            source={{uri: course.img_url_mobile}}
                            style={styles.courseImage}
                            ref={(image) => this.references.image = image}
                            onLayout={(e) => { this.onLayout('_imageHeight', e.nativeEvent.layout) }}
                        >
                            <View style={styles.time}>
                                <Text style={styles.timeText}>
                                    {courseLength}
                                </Text>
                            </View>
                        </Image>
                    </View>
                    <View
                        style={[styles.slideContent, { height: height - this._imageHeight - 10 }]}
                    >
                        <View
                            ref={(content) => this.references.content = content}
                            onLayout={(e) => { this.onLayout('_contentHeight', e.nativeEvent.layout) }}
                        >
                            <Text
                                style={styles.courseNameText}
                            >
                                {course.name}
                            </Text>
                            <Text style={styles.teacherText}>{course.teacher}</Text>
                            <View style={styles.footer}>
                                <Text style={styles.priceText}>{course.price && `$${course.price}`|| 'Free'}</Text>
                                <View style={styles.stars}>
                                    <StarRating
                                        disabled={true}
                                        maxStars={5}
                                        rating={course.rating}
                                        starColor={Colors.star}
                                        emptyStarColor={Colors.fontGrey}
                                        emptyStar={'star'}
                                        starSize={20}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

CourseCard.propTypes = {
    course: PropTypes.object,
    height: PropTypes.number,
    navigation: PropTypes.object,
    setMaxHeightCallback: PropTypes.func,
};

const styles = StyleSheet.create({
    slide: {
        width: (_windowWidth - 20) / 2,
        height: 258,
        margin: 5,
    },
    courseImage: {
        height: (_windowWidth - 20) / 2,
        shadowRadius: 4,
        shadowColor: Colors.mainBlack,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 0,
            height: 0,
        },
    },
    time: {
        backgroundColor: Colors.mainOrange,
        borderRadius: 6,
        width: 51,
        height: 16,
        position: 'absolute',
        right: 7,
        bottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    timeText: {
        color: Colors.mainWhite,
        fontSize: 12,
    },
    slideContent: {
        shadowRadius: 4,
        shadowColor: Colors.mainBlack,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 0,
            height: 0
        },
        padding: 10,
        alignItems: 'center',
    },
    courseNameText: {
        fontSize: 13,
        fontWeight: 'bold',
        paddingTop: 10,
        textAlign: 'center',
    },
    teacherText: {
        fontSize: 12,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priceText: {
        fontSize: 12,
        fontWeight: 'bold',
        paddingTop: 3,
    },
    stars: {
        width: 90,
    },
});
