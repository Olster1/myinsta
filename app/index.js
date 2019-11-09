import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router, 
} from "react-router-dom";

import App from './components/App.jsx';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './actionReducers/index.js';

///// Initial Redux store state ///////

let initialState = {
  userInfo: {
  	_id: '',
  	email: '',
  	isLoggedIn: false
  },
  userIsLoading: false,
  feedPosts: [],
  feedIsLoading: false,
};

///////////////////////////////

///// Create the store ///////
let store = createStore(
        rootReducer,
        initialState,
    );

///////////////////////////////

let basePath = '/';
// if (process.env.NODE_ENV === 'production') {
//   basePath = '/warbler';
// }

ReactDOM.render(
  <Provider store={store}>
  	<Router basename={basePath}>
    	<App/>
    </Router>
  </Provider>,
  document.getElementById('mount')
);