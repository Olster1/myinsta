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

///////////////////////************ GET REQUETS *************////////////////////

//NOTE(ollie): Get requests done through requesting a learning plan

///////////////////////************* CREATE REQUESTS ************////////////////////

router.post('/createMilestone', checkToken, (req, httpRes, next) => {

	const userId = req.userId;
	const planId = req.body.planId;

	planModel.findOne({ _id: planId, ownerIds: userId }, (err, documentResult) => {
		if(err) {
			return next(err);
		}
		if(documentResult != null) {

			const milestone = new milestoneModel({
				objective: req.body.objective,
				type: req.body.type,
				planId: planId,
				content: req.body.content,
				depth: req.body.depth,
				childrenIds: [],
				finished: false
			});

			milestone.save((err2, result) => {
				if(err2) {
					console.log("was error");
					httpRes.json({
						result: constants.ERROR,
						data: {},
						message: 'error saving',
					});
				} else {
					console.log("depth is: " + req.body.depth);
					if(req.body.depth > 0) {
						//NOTE(ollie): Need to add it to parent
						milestoneModel.updateOne({ _id: req.body.parentId }, { $push: { childrenIds: result._id } }, (updateErr, updateRes) => {
							if(updateErr) {
								console.log("was error");
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
					} else {
						httpRes.json({
							result: constants.SUCCESS,
							data: result,
							message: 'save successful',
						});
					}
				}
			});

		} else {
			httpRes.json({
				result: constants.FAILED,
				data: {},
				message: 'User not part of the learning plan',
			});
		}
	});
	
});

///////////////////////************ UPDATE REQUESTS *************////////////////////

router.post('/updateMilestone', checkToken, (req, httpRes, next) => {
	const userId = req.userId;
	const planId = req.body.planId;
	const milestoneId = req.body.milestoneId;

	planModel.findOne({ _id: planId, ownerIds: userId }, (err, documentResult) => {
		if(err) {
			return next(err);
		}
		if(documentResult != null) { //is part of a plan that the user owns
			milestoneModel.updateOne({ _id: milestoneId }, { finished: req.body.finished, updated_at: new Date() }, (err2, documentResult) => {
				if(err2) {
					return next(err2);
				} else {
					httpRes.json({
						result: constants.SUCCESS,
						data: {},
						message: 'updated successful',
					});
				}
			});
		}
	});
});

///////////////////////************* DELETE REQUESTS ************////////////////////

router.post('/deleteMilestone', checkToken, (req, httpRes, next) => {
	const userId = req.userId;
	const planId = req.body.planId;
	const milestoneId = req.body.milestoneId;
	const parentMilestoneId = req.body.parentId;
	const depth = req.body.depth;

	planModel.findOne({ _id: planId, ownerIds: userId }, (err, documentResult) => {
		if(err) {
			return next(err);
		}
		if(documentResult != null) { //is part of a plan that the user owns
			milestoneModel.deleteOne({ _id: milestoneId }, (err2) => {
				if(err2) {
					return next(err2);
				} else {
					if(depth > 0) {
						//NOTE(ollie): Remove the id from 
						milestoneModel.update({ _id: parentMilestoneId }, { $pull: { childrenIds: milestoneId } }, (err3) => {
							if(err3) {
								return next(err3);
							} else {
								httpRes.json({
									result: constants.SUCCESS,
									data: {},
									message: 'deleted successful',
								});	
							}
						});
					} else {
						httpRes.json({
							result: constants.SUCCESS,
							data: {},
							message: 'deleted successful',
						});	
					}
				}
			});
		}
	});
});


////////////////////////////////////////////////////////////////////

module.exports = router;