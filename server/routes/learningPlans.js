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

function getMilestonesForPlan(plan, next, end, finalCb) {
	//Get the milestones
	console.log("starting looking");
	console.log(plan._id);
	milestoneModel.find({ planId: plan._id }, (err, milestones) => {
		if(err) {
			return next(err);
		} else {
			console.log("milestones");
			console.log(milestones);

			if(milestones.length === 0 && end) {
				finalCb();	
			} 

			for(let i = 0; i < milestones.length; ++i) {
				let m = milestones[i];

				if(m.depth === 0) { //push on as parent
					plan.items.push(m);
				}

				if(i === milestones.length - 1 && end && m.childrenIds.length === 0) {
					finalCb();
				}

				for(let j = 0; j < m.childrenIds.length; ++j) {
					milestoneModel.findOne({ _id: m.childrenIds[j]._id, planId: plan._id }, (err, milestoneSingle) => {
						if(err) {
							return next(err);
						} else {
							if(milestoneSingle) {
								m.items[j] = milestoneSingle;	
							}
						}

						if(i === milestones.length - 1 && j ===  m.childrenIds.length - 1 && end) {
							finalCb();	
						}
					});
				}
			}


		}
	});
}

///////////////////////************ GET REQUETS *************////////////////////

router.post('/getPlansForUser', checkToken, (req, httpRes, next) => {
	const userId = req.userId;

	console.log("userId is: " + userId);

	planModel.find({ ownerIds: userId }, (err, documentResult) => {
		if(err) {
			httpRes.json({
				result: constants.ERROR,
				data: {},
				message: 'Something went wrong with database',
			});
		}

		for (let i = 0; i < documentResult.length; i++) {
			getMilestonesForPlan(documentResult[i], next, (i === (documentResult.length - 1)), () => {
				httpRes.json({
					result: constants.SUCCESS,
					data: documentResult,
					message: 'Got the data',
				});
			});
		}
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
			getMilestonesForPlan(documentResult, next, true, () => {
				httpRes.json({
					result: constants.SUCCESS,
					data: documentResult,
					message: 'Got the data',
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