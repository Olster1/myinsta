import { combineReducers } from 'redux';

import { feedPosts, feedIsLoading } from './posts';

import { userInfo, userIsLoading } from './user';

import { userLessons } from './LessonPlans';

export default combineReducers({
    userInfo,
    userIsLoading, 
    feedPosts, 
    feedIsLoading,
    userLessons,
});