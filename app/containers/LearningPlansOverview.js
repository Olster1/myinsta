import React, { Component } from 'react'
import {
  Redirect
} from "react-router-dom";
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

///////////////************ API *************////////////////////

import {  getPlansForUser, addPlanForUser, removePlanFromUser } from "../utils/api"


//////*********** ACTIONS *******////////////

import { addUserLessons, addLessonPlan, removeLessonPlan } from "../actionReducers/LessonPlans.js";

/////********** COMPONENTS *********///////////

import AddLearningPlan from './AddLearningPlan';
import Loader from '../components/Loader';

///////////////////////*********** Bootsrap Components **************////////////////////

import { Form, Button, Spinner } from 'react-bootstrap'

////////////////////////////////////////////////////////////////////

class LearningPlanOverview extends Component {
	constructor() {
	  super();
	  this.state = {
	  	plan: null,
	  	loading: true,
	  	errorMessage: "",
	  	apiLoading: false,
	  	showingModal: false
	  };
	}

	componentDidMount () {
		if(this.props.userLessons.length === 0) {
			this.props.retrievePlansForUser(this); //just fetch everything
		} else {
			this.setState({ loading: false });
		}
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

		const myPlans = this.props.userLessons.map((p) => {
			const color = p.isPublic ? "brand-bg-aqua" : "brand-bg-yellow";
			const link = '/plan/' + p._id;
			const cssClasses = "my-form-div " + color;
			return (
				<Link key={p._id} to={ link }><div className={cssClasses}>
					{ p.objective }
				</div></Link>
			);
		});

		if(!this.props.isLoggedIn) {
			return (
				<Redirect to='/login' />
			);
		} else if(this.state.loading) {
			return (
				<div>
					<Loader /> 
				</div> );
		} else {
			return (
		        <div className="my-form-div">
		        	<h1>My Plans</h1>
		        	{ myPlans }
		        	<Button variant="primary" onClick={this.handleModalOpen.bind(this)}>
		        		{ (this.state.apiLoading) ? spinner : false }
		        	  Add New Plan
		        	</Button>
		        	{ this.state.errorMessage }
		        	<AddLearningPlan isShowing={this.state.showingModal} handleClose={this.handleModalClose.bind(this)} />
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
	retrievePlansForUser: function(it) {
		it.setState({ loading: true });
		getPlansForUser((result, message, data) => {
		  console.log(message);
		  if(result === "ERROR" || result === "FAILED") {
		    console.log("failed");
		    console.log(message);
		    it.setState({ errorMessage: message });
		  } else {
		    dispatch(addUserLessons(data));

		    it.setState({ errorMessage: "" });
		  }
		  it.setState({ loading: false });
		})
	},
	addPlan: function(objective, isPublic, endDate) {
		it.setState({ apiLoading: true });
		addPlanForUser(objective, isPublic, endDate, (result, message, data) => {
		  if(result === "ERROR" || result === "FAILED") it.setState({ errorMessage: message });
		  if(result === "SUCCESS") dispatch(addLessonPlan(data)); it.setState({ errorMessage: "" });
		  it.setState({ apiLoading: false });
		});
	},
	removePlan: function(id) {
		it.setState({ apiLoading: true });
		removePlanFromUser(id, (result, message, data) => {
		  if(result === "ERROR" || result === "FAILED") it.setState({ errorMessage: message });
		  if(result === "SUCCESS") dispatch(removeLessonPlan(id)); it.setState({ errorMessage: "" }); 
		  it.setState({ apiLoading: false });
		});
	}

})

export default connect(mapStateToProps, mapDispatchToProps)(LearningPlanOverview);