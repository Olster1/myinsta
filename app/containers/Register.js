import React, { Component } from 'react'
import {
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux';

///////////////************ API *************////////////////////

import {  registerUser } from "../utils/api"


//////*********** ACTIONS *******////////////

import { setUserData, setLoadingUser } from "../actionReducers/user.js";

/////********** COMPONENTS *********///////////

import Loader from '../components/Loader';

///////////////////////*********** Bootsrap Components **************////////////////////

import { Form, Button, Spinner} from 'react-bootstrap'

////////////////////////////////////////////////////////////////////

class Register extends Component {
	constructor() {
	  super();
	  this.state = {
	  	email: "",
	  	password: "",
	  	registerErrorMessage: ""
	  };
	}

	updateEmail(event) {
	  this.setState({email: event.target.value});
	}

	updatePassword(event) {
	  this.setState({password: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();

		this.props.tryRegister(this.state.email, this.state.password, this);
	}


	render() {
		let spinner = <Spinner
						      as="span"
						      animation="grow"
						      size="sm"
						      role="status"
						      aria-hidden="true"
						    />;

		if(!this.props.userIsLoading) {
			spinner = false;
		}
		if(this.props.isLoggedIn) {
			return (
				<Redirect to='/' />
			)
		} else {
			return (
		        <div className="my-form-div brand-bg-aqua">
		        <h1> Register </h1>
		          <Form onSubmit={this.handleSubmit.bind(this)}>
		            <Form.Group controlId="formBasicEmail">
		              <Form.Label>Email address</Form.Label>
		              <Form.Control type="email" placeholder="Enter email" value={this.state.email} onChange={this.updateEmail.bind(this)} />
		              <Form.Text className="text-muted">
		                We'll never share your email with anyone else.
		              </Form.Text>
		            </Form.Group>

		            <Form.Group controlId="formBasicPassword">
		              <Form.Label>Password</Form.Label>
		              <Form.Control type="password" placeholder="Password" value={this.state.password} onChange={this.updatePassword.bind(this)} />
		            </Form.Group>
		            <Button variant="primary" type="submit">
		              { spinner }
		              Submit
		            </Button>
		          </Form>   
		          
		          <p style={{ color: 'red' }}>{this.state.registerErrorMessage}</p>
		        </div>
		    );
		}
	}
}


const mapStateToProps = (state, ownProps) => ({
  userIsLoading: state.userIsLoading,
  isLoggedIn: state.userInfo.isLoggedIn
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  tryRegister: function(email, password, it) {

    dispatch(setLoadingUser(true));
    registerUser(email, password, (result, message, data) => {
      console.log(message);
      if(result === "ERROR" || result === "FAILED") {
        console.log("failed");
        it.setState({ registerErrorMessage: message });
        dispatch(setUserData({
            isLoggedIn: false,
            email: "",
            _id: null
          })
        );
      } else {
      	it.setState({ registerErrorMessage: "" });
        dispatch(setUserData(data));
        console.log("setting user info");
      }
      console.log("setting loading to false");
      dispatch(setLoadingUser(false));

    })
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Register);