import React from 'react';
import {Elements} from 'react-stripe-elements';

///////////////////////*********** React Router **************////////////////////

import { Redirect } from "react-router-dom";

///////////////////////*********** Redux **************////////////////////

import { connect } from 'react-redux';

///////////////////////*********** Components **************////////////////////

import Loader from './Loader'

////////////////////////////////////////////////////////////////////

import InjectedCheckoutForm from './MyCheckoutForm';

class MyStoreCheckout extends React.Component {

  render() {
  	console.log(`isLoggedIn: ${this.props.isLoggedIn}`);
  	console.log(`userIsLoading: ${this.props.userIsLoading}`);
  	//NOTE: This is blocked from users not logged in 
  	if(!this.props.isLoggedIn && !this.props.userIsLoading) {
  		return (
  			<Redirect to='/' />
  		) 
  	} else if(this.props.isLoggedIn) {
	    return (
	      <Elements>
	        <InjectedCheckoutForm />
	      </Elements>
	    );
	} else if(this.props.userIsLoading && !this.props.isLoggedIn) {
		return (
			<Loader />
		)
	}
  }
}

const mapStateToProps = (state, ownProps) => ({
  isLoggedIn: state.userInfo.isLoggedIn,
  userIsLoading: state.userIsLoading
})

const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(MyStoreCheckout);