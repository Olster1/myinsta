import React, { Component } from 'react'
import {
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux';

///////////////************ API *************////////////////////

import {  getPlansForUser } from "../utils/api"


//////*********** ACTIONS *******////////////

import { addUserLessons, setUserPlan } from "../actionReducers/LessonPlans.js";

/////********** COMPONENTS *********///////////

import AddMilestone from './AddMilestone';
import Loader from '../components/Loader';

///////////////////////*********** Bootsrap Components **************////////////////////

import { Form, Button, Spinner, ProgressBar } from 'react-bootstrap'

////////////////////////////////////////////////////////////////////

function findPlan(planId, userLessons) {
	//@speed
	let result = null;

	console.log("THE IDS" + userLessons);
	//NOTE(ollie): Find the plan
	for(let i = 0; i < userLessons.length && result === null; ++i) {
		const plan = userLessons[i];
		console.log("THE IDS");
		console.log(planId);
		console.log(plan._id);
		if(plan._id === planId) {
			result = plan;
			break;
		}
	}
	//

	return result;
}

class LearningPlan extends Component {
	constructor() {
	  super();
	  this.state = {
	  	loading: true,
	  };
	}

	

	componentDidMount () {
   		const planId = this.props.match.params.planId;

   		// let result = this.findPlan(this, planId);
   		if(this.props.plan && this.props.plan._id === planId) {
   			this.setState({ loading: false });
   		} else {
	   		this.props.retrievePlansForUser(planId, this); //just fetch everything
	   	}
  	}
  	milestoneRecursive(myArray, depth) {
  		if(myArray && myArray.length > 0) {
  			return myArray.map(item => {
  				const button = (depth < 4) ? <AddMilestone planId={this.props.plan._id} parentId={item._id} depth={depth} /> : false;
  				const mVal = (depth*10) + "%";
  				const topClass = (depth === 1) ? "my-form-div brand-bg-yellow" : "";
  				const myStyle = (depth === 1) ? {} : { marginLeft: mVal };
  				return (
  				<div key={item._id} style={ myStyle } className={topClass}>
  					<ProgressBar now={40} />
  					<p>{item.objective}</p>
  					<p>{item.content}</p>
  					{ button }
  					<br />
  					{ this.milestoneRecursive(item.items, depth + 1)}
  				</div>
  				)
  			});	
  		} else {
  			return false;
  		}
  		
  	}

  	getMilestonesHtml() {
  		const result = this.milestoneRecursive(this.props.plan.items, 1);
  		return result;
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
					<Loader />
				</div> );
		} else if(!this.state.loading && !this.props.plan) {
			
			return (
				<Redirect to='/pages' />
			);
		} else {
			const milestones = this.getMilestonesHtml();
			return (
		        <div>
		        	<div className="my-form-div brand-bg-yellow">
		        		<h1>My Plan</h1>
		        		<h3>My Goal is to { this.props.plan.objective }</h3>
		        	</div>
		        	{ milestones }

		        	<div className="my-form-div brand-bg-yellow">
		        	{ this.state.errorMessage }
		        	<AddMilestone planId={this.props.plan._id} parentId="0" depth="0" />
		        	</div>
		        </div>
		    );
		}
	}
}


const mapStateToProps = function(state, ownProps) {
	const planId = ownProps.match.params.planId;
  	const plan = findPlan(planId, state.userLessons);

  	return {
  		isLoggedIn: state.userInfo.isLoggedIn,
  		userLessons: state.userLessons,
  		plan: plan
  	}
}

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
		    console.log("setting lessons info");
		  }
		  console.log("setting loading to false");
		  it.setState({ loading: false });
		})
	}

})

export default connect(mapStateToProps, mapDispatchToProps)(LearningPlan);