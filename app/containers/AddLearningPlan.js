


      import React, { Component } from 'react'
      import {
        Redirect
      } from "react-router-dom";
      import { connect } from 'react-redux';

      ///////////////************ API *************////////////////////

      import { addPlanForUser } from "../utils/api"

      //////*********** ACTIONS *******////////////

      import { addLessonPlan  } from "../actionReducers/LessonPlans.js";

      /////********** COMPONENTS *********///////////

      ///////////////////////*********** Bootsrap Components **************////////////////////

      import { Modal, FormControl } from 'react-bootstrap'

      ////////////////////////////////////////////////////////////////////

      class AddLearningPlan extends Component {
        constructor() {
          super();
          this.state = {
            objective: "",
            isPublic: false,
            endDate: new Data(),
            errorMessage: "",
            apiLoading: false
          };
        }


        handleObjectiveChange(event) {
          this.setState({ objective: event.target.value });
        }

        handleCheckboxChange(event) {
          this.setState({ isPublic: event.target.value });
        }

        render() {
          return (
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
                <FormControl 
                  type='checkbox'
                  label="isPublic"
                  defaultValue={false}
                  onChange={this.handleCheckboxChange.bind(this)}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.props.handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.addPlan.bind(this)}>
                 Add New Plan
                </Button>
              </Modal.Footer>
            </Modal>
          )
        }
      }


      const mapStateToProps = (state, ownProps) => ({
      });

      const mapDispatchToProps = (dispatch, ownProps) => ({
        addPlan: function(objective, isPublic, endDate, it) {
          it.setState({ apiLoading: true });
          addPlanForUser(objective, isPublic, endDate, (result, message, data) => {
            if(result === "ERROR" || result === "FAILED") it.setState({ errorMessage: message });
            if(result === "SUCCESS") dispatch(addLessonPlan(data)); it.setState({ errorMessage: "" });
            it.setState({ apiLoading: false });
          });
        }
      })

      export default connect(mapStateToProps, mapDispatchToProps)(AddLearningPlan);