import React, { Component } from 'react'
import {
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux';

///////////////************ API *************////////////////////

import {  loginUser } from "../utils/api"

//////////////////////////////////////

//////*********** ACTIONS *******////////////

import { setUserData, setLoadingUser } from "../actionReducers/user.js";


/////********** COMPONENTS *********///////////

import Loader from '../components/Loader';


class Login extends Component {
	constructor() {
	  super();
	  this.state = {
	  	email: "",
	  	password: ""
	  };
	}

	updateEmail(event) {
	  this.setState({email: event.target.value});
	}

	updatePassword(event) {
	  this.setState({password: event.target.value});
	}

	handleSubmit() {
		event.preventDefault();

		this.props.tryLogin(this.state.email, this.state.password);
	}


	render() {
		let spinner = <Loader />;

		if(!this.props.userIsLoading) {
			spinner = false;
		}
		if(this.props.isLoggedIn) {
			return (
				<Redirect to='/' />
			)
		} else {
			return (
		        <div>
		          <form onSubmit={this.handleSubmit.bind(this)}>
		            <label>
		              Email:
		              <input type="email" value={this.state.email} onChange={this.updateEmail.bind(this)} />
		            </label>
		            <br />
		            <label>
		              Password:
		              <input type="password" value={this.state.password} onChange={this.updatePassword.bind(this)} />
		            </label>
		             <br />
		            <input type="submit" value="Submit" />
		          </form>
		          { spinner }
		          <p>{this.props.loginErrorMessage}</p>
		        </div>
		    );
		}
	}
}

const mapStateToProps = (state, ownProps) => ({
  loginErrorMessage: state.loginErrorMessage,
  userIsLoading: state.userIsLoading,
  isLoggedIn: state.userInfo.isLoggedIn
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  tryLogin: function(email, password) {

    dispatch(setLoadingUser(true));
    loginUser(email, password, (result, message, data) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);