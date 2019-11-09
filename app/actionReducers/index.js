import { combineReducers } from 'redux';

import { feedPosts, feedIsLoading } from './posts';

import { userInfo, userIsLoading } from './user';

export default combineReducers({
    userInfo,
    userIsLoading, 
    feedPosts, 
    feedIsLoading
});