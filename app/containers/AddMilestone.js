import React, { Component } from 'react'
import {
Redirect
} from "react-router-dom";
import { connect } from 'react-redux';

///////////////************ API *************////////////////////

import { addMilestoneToPlan } from "../utils/api"

//////*********** ACTIONS *******////////////

import { addMilestone } from "../actionReducers/LessonPlans.js";

/////********** COMPONENTS *********///////////

///////////////////////*********** Bootsrap Components **************////////////////////

import { Modal, FormControl, Form, Button, Spinner, InputGroup } from 'react-bootstrap'

////////////////////////////////////////////////////////////////////

class AddMilestone extends Component {
constructor() {
  super();
  this.state = {
    objective: "Write a song in GarageBand",
    type: "Project",
    endDate: new Date(),
    errorMessage: "",
    apiLoading: false,
    content: ""
  };
}


handleObjectiveChange(event) {
  this.setState({ objective: event.target.value });
}

handleCheckboxChange(event) {
  this.setState({ type: event.target.value });
}

handleChangeContent(event) {
	this.setState({ content: event.target.value });
}

addMilestone() {
	console.log("HIS");
	console.log(this);
    this.props.addMilestoneToPlan(this.props.planId, this.state.objective, this.state.type, this.props.parentId, this.state.content, this.props.depth, this);
}

render() {
  let spinner = <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />;
  return (
  	<div>
  	<Button variant="primary" onClick={this.props.handleModalOpen}>
  		{ (this.props.apiLoading) ? spinner : false }
  	  Add New Milestone
  	</Button>
    <Modal show={this.props.isShowing} onHide={this.props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Adding New Plan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span>What is your objective? </span>
        <FormControl 
          type='text'
          name='objective' 
          defaultValue={this.state.objective}
          onChange={this.handleObjectiveChange.bind(this)}
        />
        <br />

        <Form.Group controlId="formGridState">
          <Form.Label>Type</Form.Label>
          <Form.Control as="select"  value={this.state.type} onChange={this.handleCheckboxChange.bind(this)}>
            <option>Project</option>
            <option>Portfolio Item</option>
            <option>Blog Post</option>
            <option>Milestone</option>
            <option>Journal Piece</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Content</Form.Label>
          <Form.Control as="textarea" rows="3"  value={this.state.content} onChange={this.handleChangeContent.bind(this)}>
          </Form.Control>
        </Form.Group>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={this.props.handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={this.addMilestone.bind(this)}>
         { (this.state.apiLoading) ? spinner : false } Add New Milestone
        </Button>
        { this.state.errorMessage }
      </Modal.Footer>
    </Modal>
    </div>
  )
}
}


const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	addMilestoneToPlan: function(planId, objective, type, parentId, content, depth, it) {
	  it.setState({ apiLoading: true });
	  addMilestoneToPlan(planId, objective, type, parentId, content, depth, (result, message, data) => {
	    if(result === "ERROR" || result === "FAILED") { it.setState({ errorMessage: message }); }
	    console.log(planId);
	    if(result === "SUCCESS") { dispatch(addMilestone(data, planId, parentId)); it.setState({ errorMessage: "" }); ownProps.handleClose(); }
	    it.setState({ apiLoading: false });
	  });
	},
	removeMilestone: function(parent, id) {
		it.setState({ apiLoading: true });
		removeMilestone(parent, id, (result, message, data) => {
		  if(result === "ERROR" || result === "FAILED") it.setState({ errorMessage: message });
		  if(result === "SUCCESS") dispatch(removeMilestone(parent, id)); it.setState({ errorMessage: "" }); 
		  it.setState({ apiLoading: false });
		});
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(AddMilestone);