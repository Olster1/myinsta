import React, { Component } from 'react'
import {
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux';

///////////////************ API *************////////////////////

import {  getPlansForUser } from "../utils/api"


//////*********** ACTIONS *******////////////

import { addUserLessons } from "../actionReducers/LessonPlans.js";

/////********** COMPONENTS *********///////////

///////////////////////*********** Bootsrap Components **************////////////////////

import { Form, Button, Spinner } from 'react-bootstrap'

////////////////////////////////////////////////////////////////////

class LearningPlan extends Component {
	constructor() {
	  super();
	  this.state = {
	  	plan: null,
	  	loading: true
	  };
	}

	findPlan(it, planId) {
		//@speed
		let result = null;

		console.log("planid " + planId);
		//NOTE(ollie): Find the plan
		for(let i = 0; i < it.props.userLessons.length && result === null; ++i) {
			const plan = it.props.userLessons[i];
			if(plan._id === planId) {
				result = plan;
				break;
			}
		}
		//

		console.log("plan " + result);
		this.setState({ plan: result });

		return result;
	}

	componentDidMount () {
		
   		const planId = this.props.match.params.planId;

   		let result = this.findPlan(this, planId);

   		if(result === null) {
   			this.props.retrievePlansForUser(planId, this); //just fetch everything
   		} else {
   			this.setState({ loading: false });
   		}
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
				<Redirect to='/login' />
			);
		} else if(this.state.loading) {
			return (
				<div>
					{ spinner }
				</div> );
		} else if(!this.state.loading && !this.state.plan) {
			return (
				<Redirect to='/plans' />
			);
		} else {
			return (
		        <div className="my-form-div brand-bg-yellow">
		        	<h1>My Plan</h1>
		        	<h3>My Goal is to { this.state.plan.objective }</h3>

		        </div>
		    );
		}
	}
}


const mapStateToProps = (state, ownProps) => ({
  	isLoggedIn: state.userInfo.isLoggedIn,
  	userLessons: state.userLessons,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	retrievePlansForUser: function(planId, it) {
		it.setState({ loading: true });
		getPlansForUser((result, message, data) => {
		  console.log(message);
		  if(result === "ERROR" || result === "FAILED") {
		    console.log("failed");
		    console.log(message);
		  } else {
		    dispatch(addUserLessons(data));

		    it.findPlan(it, planId);

		    console.log("setting lessons info");
		  }
		  console.log("setting loading to false");
		  it.setState({ loading: false });
		})
	},

})

export default connect(mapStateToProps, mapDispatchToProps)(LearningPlan);