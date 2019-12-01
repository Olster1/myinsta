var express = require('express')
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const constants = require('../utils/constants');
const { checkToken, checkNoToken } = require('../utils/auth');
const path = require('path');

const helperFuncs = require('../utils/helperFuncs');


const mongoose = require('mongoose');
///////////////////////************ Database models *************////////////////////

const planModel = require(path.resolve(__dirname, '../models/learningPlan.js'));
const userModel = require(path.resolve(__dirname, '../models/users.js'));
const milestoneModel = require(path.resolve(__dirname, '../models/milestone.js'));

////////////////////////////////////////////////////////////////////

var router = express.Router();

///////////////////////*********** HELPER FUNCTIONS **************////////////////////

//@speed this is just looping through the array. Is there a better way? Maybe with mongo you can index ny _id? 
function findMilestone(milestonePool, childId, planId) {
	let result = null;

	for (let i = 0; i < milestonePool.length && result === null; i++) {
		let m = milestonePool[i];
		let id = m._id;
		let testPlanId = m.planId;

		if(id.toString() === childId.toString() && testPlanId.toString() === planId.toString()) { //since they are objects we derefence them
			result = m;
			break;
		}
	}

	return result;
}

function populateMilestone(m, plan, milestonePool) {
	if(m.depth === 0) { //push on as parent
		plan.items.push(m);
	}

	if(m.childrenIds.length === 0) {
		
	} else {
		for(let j = 0; j < m.childrenIds.length; ++j) {
			let childId = m.childrenIds[j]._id;

			let milestoneSingle = findMilestone(milestonePool, childId, plan._id);
				
			if(milestoneSingle) {
				if(m.items === undefined) {
					m.items = new Array();
				}
				m.items.push(milestoneSingle);
			} else {
				console.log("HI SIS A EREROR");
			}
		}
	}
}

function getMilestonesForPlan(plan) {
	return new Promise(function(resolve, reject) {
		//Get the milestones
		milestoneModel.find({ planId: plan._id }, (err, milestones) => {
			if(err) {
				return reject(err);
			} else {
				if(milestones.length === 0) {
					return resolve("no milestones in plan");
				} 

				for(let i = 0; i < milestones.length; ++i) {
					let m = milestones[i];
					populateMilestone(m, plan, milestones);
				}

				return resolve("finished");
			}
		});
	});
}

///////////////////////************ GET REQUETS *************////////////////////

router.post('/getPlansForUser', checkToken, (req, httpRes, next) => {
	const userId = req.userId;

	planModel.find({ ownerIds: userId }, (err, documentResult) => {
		if(err) {
			httpRes.json({
				result: constants.ERROR,
				data: {},
				message: 'Something went wrong with database',
			});
		}

		let promises = [];

		for (let i = 0; i < documentResult.length; i++) {
			promises.push(getMilestonesForPlan(documentResult[i]));
		}

		//Wait for all the async to finish
		Promise.all(promises).then((values) => {
			console.log("documentResult");
			
			httpRes.json({
				result: constants.SUCCESS,
				data: documentResult,
				message: 'Got the data',
			});
		}).catch((err) => {
			return next(err);
		});
	});
});

router.post('/getSinglePlanForUser', checkToken, (req, httpRes, next) => {
	const userId = req.userId;

	const planId = req.body.planId;

	console.log("userId is: " + userId);

	planModel.findOne({ _id: planId, ownerIds: userId }, (err, documentResult) => {
		if(err) {
			httpRes.json({
				result: constants.ERROR,
				data: {},
				message: 'Something went wrong with database',
			});
		}

		if(documentResult != null) {
			let p = getMilestonesForPlan(documentResult);

			//Wait for all the async to finish
			p.then((val) => {
				httpRes.json({
					result: constants.SUCCESS,
					data: documentResult,
					message: 'Got the data',
				});
			}).catch((err) => {
				httpRes.json({
					result: constants.ERROR,
					data: {},
					message: 'Server error',
				});
			});

			
		} else {
			httpRes.json({
				result: constants.FAILED,
				data: {},
				message: 'No Plan found',
			});
		}
	});
});


///////////////////////************* CREATE REQUESTS ************////////////////////


router.post('/createPlan', checkToken, (req, httpRes, next) => {

	const ids = [ req.userId ];

	const plan = new planModel({
		objective: req.body.objective,
		isPublic: req.body.isPublic,
		ownerIds: ids
	});

	plan.save((err, result) => {
		if(err) {
			console.log("was error");
			httpRes.json({
				result: constants.ERROR,
				data: {},
				message: 'error saving',
			});
		} else {
			console.log("successful");
			httpRes.json({
				result: constants.SUCCESS,
				data: result,
				message: 'save successful',
			});
		}
	});

});

///////////////////////************ UPDATE REQUESTS *************////////////////////

router.post('/updatePlan', checkToken, (req, httpRes, next) => {
	const userId = req.userId;
	const planId = req.body.planId;

	console.log("userId is: " + userId);

	const updatedPlan = {
		objective: req.body.objective,
		isPublic: req.body.isPublic,
		ownerIds: req.body.ids,
		updated_at: new Date()
	};

	planModel.updateOne({ _id: planId, ownerIds: userId }, updatedPlan, (err, result) => {
		if(err) {
			httpRes.json({
				result: constants.ERROR,
				data: {},
				message: 'Something went wrong with database',
			});
		} else {
			httpRes.json({
				result: constants.SUCCESS,
				data: {},
				message: 'update successful',
			});
		}
	});
});

///////////////////////************* DELETE REQUESTS ************////////////////////

router.post('/deletePlan', checkToken, (req, httpRes, next) => {
	const userId = req.userId;
	const planId = req.body.planId;

	console.log("userId is: " + userId);

	planModel.deleteOne({ _id: planId, ownerIds: userId }, (err) => {
		if(err) {
			httpRes.json({
				result: constants.ERROR,
				data: {},
				message: 'Something went wrong with database',
			});
		} else {
			planModel.delete({ planId: planId }, (err2) => {
				if(err2) {
					next(err2);
				} else {
					httpRes.json({
						result: constants.SUCCESS,
						data: {},
						message: 'delete successful',
					});	
				}
			});
		}
	});
});


////////////////////////////////////////////////////////////////////

module.exports = router;