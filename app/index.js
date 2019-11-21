import React, { Component } from "react";
import ReactDOM from "react-dom";

///////////////////////*********** Bootstrap css **************////////////////////

//NOTE(ollie): We don't need this since we load it from the CDN  
// import 'bootstrap/dist/css/bootstrap.min.css';

////////////////////////////////////////////////////////////////////

import {
  BrowserRouter as Router, 
} from "react-router-dom";

import App from './components/App.jsx';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './actionReducers/index.js';

import {StripeProvider} from 'react-stripe-elements';

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
  <StripeProvider apiKey="pk_test_vYbJgTKHJ0hp6vJv3gzB6UoJ007vFCKtMo" >
    <Provider store={store}>
    	<Router basename={basePath}>
    	<App />
      </Router>
    </Provider>
  </StripeProvider>,
  document.getElementById('mount')
);