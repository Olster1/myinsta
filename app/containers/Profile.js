import React, { Component } from 'react'
import {
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux';

///////////////************ API *************////////////////////

// import {  loginUser } from "../utils/api"


//////*********** ACTIONS *******////////////

// import { setUserData, setLoadingUser } from "../actionReducers/user.js";

/////********** COMPONENTS *********///////////

///////////////////////*********** Bootsrap Components **************////////////////////

import { Button, Spinner } from 'react-bootstrap'

////////////////////////////////////////////////////////////////////

class Profile extends Component {
	constructor() {
	  super();
	  this.state = {
	  };
	}

	render() {
		let spinner = <Spinner
						      as="span"
						      animation="grow"
						      size="sm"
						      role="status"
						      aria-hidden="true"
						    />;

		if(!this.props.isLoggedIn) {
			return (
				<Redirect to='/' />
			)
		} else {
			return (
		        <div className="my-form-div brand-bg-yellow">
		        <h1> Profile </h1>
		        <h3> Email is: { this.props.userInfo.email } </h3>
		        <h3> My id is: { this.props.userInfo._id } </h3>
		        </div>
		    );
		}
	}
}


const mapStateToProps = (state, ownProps) => ({
  isLoggedIn: state.userInfo.isLoggedIn,
  userInfo: state.userInfo
})

const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);