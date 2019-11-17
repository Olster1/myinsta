import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  Switch, 
  Route, 
  Link,
  withRouter
} from "react-router-dom";
import { connect } from 'react-redux';


////////******** COMMON FOR ALL PAGES *******///////

import MyNavBar from './MyNavBar.js';

///////////////////////////////////////

///////////////************ API *************////////////////////

import {  isLoggedIn, logout } from "../utils/api"

//////////////////////////////////////

//////*********** ACTIONS *******////////////

import { setUserData, setLoadingUser } from "../actionReducers/user.js";

///////////////////////////////////////////



/////********** MAIN PAGES *********///////////

import Feed from '../containers/Feed';
import SinglePost from '../containers/SinglePost';
import Profile from '../containers/Profile';
import Login from '../containers/Login';
import Register from '../containers/Register';

////////////////////////////////////////////////

class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
    };

  }


  componentDidMount() {
   this.props.tryLogin();
  }

  render() {
    return (
      <div>
        <MyNavBar loggedIn={this.props.isLoggedIn} logout={this.props.logout} />
        <Switch>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/feed">
            <Feed />
          </Route>
          <Route path="/profile/:profileId">
            <Profile profileId={0} />
          </Route>
          <Route path="/post/:postId">
            <SinglePost profileId={1} />
          </Route>
        </Switch>
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => ({
  isLoggedIn: state.userInfo.isLoggedIn
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  tryLogin: function() {
    console.log("try log in");
    dispatch(setLoadingUser(true));
    isLoggedIn((result, message, data) => {
      console.log(message);
      if(result === "ERROR" || result === "FAILED") {
        console.log("failed");
        dispatch(setUserData({
            isLoggedIn: false,
            email: "",
            _id: null
          })
        );
      } else {
        dispatch(setUserData(data));
        console.log("setting user info");
      }
      console.log("setting loading to false");
      dispatch(setLoadingUser(false));
    })
  },
  logout: function() {
    console.log("loggingOut");
    dispatch(setLoadingUser(true));
    logout((result, message, data) => {
      console.log(message);
      if(result === "ERROR" || result === "FAILED") {
        console.log("failed");
      } else {
        dispatch(setUserData({
            isLoggedIn: false,
            email: "",
            _id: null
          })
        );
        console.log("setting user info");
      }
      console.log("setting loading to false");
      dispatch(setLoadingUser(false));
    })
  }
})


// export default withRouter(App);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
