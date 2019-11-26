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

import Profile from '../containers/Profile';
import Login from '../containers/Login';
import Register from '../containers/Register';
import LearningPlan from '../containers/LearningPlan';
import LearningPlansOverview from '../containers/LearningPlansOverview';
import MyStoreCheckout from './MyStoreCheckout';
import Loader from './Loader';
import Default404 from './404';
import HomePage from './Homepage';


///////////////////////************ Articles *************////////////////////
/*
This is just temporary. We eventaully want to store it in the database & just retrive what 
article we actually need based on the paramerter in url. 
*/

import MindsetArticle from './articles/mindset';

////////////////////////////////////////////////

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };

  }

  getMyRoutes() {
    return (
      <Switch>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/plan/:planId" component={LearningPlan} />
        <Route path="/plans">
          <LearningPlansOverview />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/checkout">
          <MyStoreCheckout />
        </Route>
         <Route path="/articles/mindset" exact >
          <MindsetArticle />
        </Route>
        <Route path="/" exact >
          <HomePage />
        </Route>
        <Route>
          <Default404 />
        </Route>
      </Switch>
    );
  }


  componentDidMount () {
   this.props.tryLogin(this);
  }

  render() {
    const routes = (this.state.loading) ? <Loader /> : this.getMyRoutes();
    return (
      <div>
        <MyNavBar loggedIn={this.props.isLoggedIn} logout={this.props.logout} />
        { routes }
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => ({
  isLoggedIn: state.userInfo.isLoggedIn,

})

const mapDispatchToProps = (dispatch, ownProps) => ({
  tryLogin: function(it) {
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
        console.log(data);
        dispatch(setUserData(data));
        console.log("setting user info");
      }
      console.log("setting loading to false");
      it.setState({loading: false});
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
