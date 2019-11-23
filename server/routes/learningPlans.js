var express = require('express')
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const constants = require('../utils/constants');
const { checkToken, checkNoToken } = require('../utils/auth');
const path = require('path');

///////////////////////************ Database models *************////////////////////

const planModel = require(path.resolve(__dirname, '../models/learningPlan.js'));
const userModel = require(path.resolve(__dirname, '../models/users.js'));

////////////////////////////////////////////////////////////////////

var router = express.Router();

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

		httpRes.json({
			result: constants.SUCCESS,
			data: documentResult,
			message: 'You got the data',
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
			httpRes.json({
				result: constants.SUCCESS,
				data: documentResult,
				message: 'You got the data',
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
			httpRes.json({
				result: constants.ERROR,
				data: {},
				message: 'error saving',
			});
		} else {
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
			httpRes.json({
				result: constants.SUCCESS,
				data: {},
				message: 'delete successful',
			});
		}
	});
});


////////////////////////////////////////////////////////////////////

module.exports = router;