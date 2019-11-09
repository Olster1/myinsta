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

import {  isLoggedIn } from "../utils/api"

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


    //Bind this to the functions
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
  }


  componentDidMount() {
   this.props.tryLogin();
  }

  logout() {
    console.log("Logout");
    this.setState({ loggedIn: false });
  }

  login() {
    console.log("Login");
    this.setState({ loggedIn: true });
  }

  render() {
    return (
      <div>
        <MyNavBar loggedIn={this.state.loggedIn} logout={this.logout} login={this.login} />
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
  active: ownProps.filter === state.visibilityFilter
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  tryLogin: function() {
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
  }
})


// export default withRouter(App);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
