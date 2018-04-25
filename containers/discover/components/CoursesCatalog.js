import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import * as _ from 'lodash';

import Colors from '../../../styles/colors';
import CATS from '../../../config/categories';
import CourseCard from './CourseCard';

const _windowWidth = Dimensions.get('window').width;

export default class CoursesCatalog extends Component {
    constructor (props) {
        super(props);

        this.state = {
            categories: [], // array of maximal heights of slides in each category
        };

        // reparse props.courses to this.state.categories = [{name:'xxx', courses:[...]},{...},...]; to use map inline
        props.courses.map(course => {
            // if course is marked as 'published: false' we shouldn't show it
            if (typeof (course.published) === 'undefined' || course.published) {
                let _currentCategory = _.find(this.state.categories, {name: CATS[course.category]});
                if (!_currentCategory) { // check if category of course is already added
                    this.state.categories.push({
                        name: CATS[course.category],
                        courses: [course],
                        height: 299, // initial height of category slides, 299 is gotten in experimental way
                        firstItem: 0,
                        carousel: null,
                    });
                } else {
                    _currentCategory.courses.push(course); // use link to object
                }

                // also we need to get rating of course
                let _rating = 0;
                let _reviewsLength = 0;
                for (let key in course.reviews) {
                    if (course.reviews.hasOwnProperty(key)) {
                        _reviewsLength++;
                        _rating += course.reviews[key].rating;
                    }
                }
                course.rating = _rating / _reviewsLength;
            }
        });

        // sort categories by courses number in array
        this.state.categories.sort((a, b) => {
            if (a.courses.length > b.courses.length) {
                return -1;
            }
            if (a.courses.length < b.courses.length) {
                return 1;
            }
            return 0;
        });
    }

    setMaxCardHeight (catName, height) {
        const _cat = _.find(this.state.categories, {name: catName});
        if (_cat && _cat.height < height) {
            _cat.height = height;
            const _newState = JSON.parse(JSON.stringify(this.state));
            this.setState(_newState);
        }
    }

    render () {
        const { navigation } = this.props;

        const innerWidth = _windowWidth - styles.categoryContainer.marginLeft - styles.categoryContainer.marginRight;

        return (
            <View style={styles.categoryContainer}>
                <View style={styles.categoryWrapper}>
                    {
                        this.state.categories.map((category, i) => {
                            return (
                                <View key={i} style={{height: 66 + category.height}}>
                                    <Text style={styles.catName}>{category.name}</Text>
                                    <View style={{...styles.carouselWrapper, height: category.height}}>
                                        <Carousel
                                            sliderWidth={_windowWidth - 20}
                                            itemWidth={140}
                                            inactiveSlideScale={1}
                                            carouselHorizontalPadding={-70}
                                            firstItem={category.firstItem}
                                            autoplay={false}
                                        >
                                            {
                                                category.courses.map((course, j) => {
                                                    return (
                                                        <CourseCard
                                                            key={j}
                                                            course={course}
                                                            height={category.height}
                                                            navigation={navigation}
                                                            setMaxHeightCallback={this.setMaxCardHeight.bind(this, category.name)}
                                                        />
                                                    );
                                                })
                                            }
                                        </Carousel>
                                    </View>
                                </View>
                            );
                        })
                    }
                </View>
            </View>
        );
    }
}

CoursesCatalog.propTypes = {
    courses: PropTypes.array,
    navigation: PropTypes.object,
};

const styles = {
    categoryContainer: {
        backgroundColor: Colors.mainWhite,
        paddingLeft: 10,
        paddingRight: 10,
    },
    categoryWrapper: {
    },
    category: {
        height: 330,
    },
    catName: {
        fontSize: 17,
        fontWeight: 'bold',
        paddingTop: 17,
    },
    carouselWrapper: {
        right: 0,
        height: 258,
    },
};
