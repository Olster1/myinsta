import React, { Component } from 'react'
import {
  Link
} from "react-router-dom";
import { connect } from 'react-redux';

///////////////************ API *************////////////////////

// import {  loginUser } from "../utils/api"


//////*********** ACTIONS *******////////////

// import { setUserData, setLoadingUser } from "../actionReducers/user.js";

/////********** COMPONENTS *********///////////

///////////////////////*********** Bootsrap Components **************////////////////////

import { Row, Col, Container } from 'react-bootstrap'

////////////////////////////////////////////////////////////////////

class Homepage extends Component {
	constructor() {
	  super();
	  this.state = {
	  };
	}

	render() {
		const loginInfo = (!this.props.isLoggedIn) ? <div><Link to='/login'>Login here</Link><br/> Or <br/><Link to='/register'>Register here</Link></div>: <div><Link to='/plans'>Your Learning Plans</Link></div>;

		return (
			<Container>
	        	<Row className="my-form-div brand-bg-yellow">
	        		<Col sm={12} md={6} ><h2>Welcome to Learnity! Where you learn!</h2></Col>
	        		<Col sm={12} md={6} >{loginInfo}</Col>
	        	</Row>
	        </Container>
	    );
	}
}


const mapStateToProps = (state, ownProps) => ({
  isLoggedIn: state.userInfo.isLoggedIn,
  userInfo: state.userInfo
})

const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);