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

import AddMilestone from './AddMilestone';

///////////////////////*********** Bootsrap Components **************////////////////////

import { Form, Button, Spinner } from 'react-bootstrap'

////////////////////////////////////////////////////////////////////

class LearningPlan extends Component {
	constructor() {
	  super();
	  this.state = {
	  	plan: null,
	  	loading: true,
	  	showingModal: false,
	  	apiLoading: false
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
  	milestoneRecursive(myArray, depth) {
  		if(myArray && myArray.length > 0) {
  			return myArray.map(item => {
  				const mVal = (depth*5) + "%";
  				return (
  				<div key={item._id} style={{ margin: mVal }}>
  					<p>{item.objective}</p>
  					<p>{item.content}</p>
  					{ this.milestoneRecursive(item.items, depth + 1)}
  				</div>
  				)
  			});	
  		} else {
  			return false;
  		}
  		
  	}

  	getMilestonesHtml() {
  		const result = this.milestoneRecursive(this.state.plan.items, 0);
  		console.log(result);
  		return result;
  	}

  	handleModalClose() {
  		this.setState({ showingModal: false });
  	}

  	handleModalOpen() {
  		this.setState({ showingModal: true });
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
			const milestones = this.getMilestonesHtml();
			console.log(milestones);
			return (
		        <div className="my-form-div brand-bg-yellow">
		        	<h1>My Plan</h1>
		        	<h3>My Goal is to { this.state.plan.objective }</h3>
		        	{ milestones }
		    
		        	{ this.state.errorMessage }
		        	<AddMilestone handleModalOpen={this.handleModalOpen.bind(this)} apiLoading={this.state.apiLoading} planId={this.state.plan._id} parentId="0" depth="0" isShowing={this.state.showingModal} handleClose={this.handleModalClose.bind(this)} />

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
	}

})

export default connect(mapStateToProps, mapDispatchToProps)(LearningPlan);