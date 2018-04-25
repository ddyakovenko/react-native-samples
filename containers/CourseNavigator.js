//Stack navigation btw "my courses" and individual course page

import React from 'react';

import { MyCourses } from './MyCourses';
import { CoursePage } from './CoursePage';
import { Player } from './Player';
import { StackNavigator } from 'react-navigation';

export const PlayerNavigator = StackNavigator(
    {
        CoursePage: { screen: CoursePage },
        Player: { screen: Player },
    },
    {
        headerMode: 'screen',
        mode: 'modal',
    }
);

export const CourseNavigator = StackNavigator(
    {
        MyCourses: { screen: MyCourses },
        PlayerNavigator: { screen: PlayerNavigator },
    },
    {
        headerMode: 'screen',
    }
);