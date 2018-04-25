// Tab navigator for the main page, initial screen lands on the "my courses" page

import React from 'react';

import { CourseNavigator } from './CourseNavigator';
import { MyProfile } from './MyProfile';
import { MyCourses } from './MyCourses';
import { CoursePage } from './CoursePage';
import { Discover } from './discover/Discover';

import { TabNavigator } from 'react-navigation';

export const MainNavigator = TabNavigator(
    {
        Discover: { screen: Discover },
        CourseNavigator: { screen: CourseNavigator },
        MyProfile: { screen: MyProfile }
    },
    {
        initialRouteName: 'CourseNavigator',
        navigationOptions: {
            tabBar: {
                visible: false
            },
            header: {
                visible: false
            }
        },
    }
);
