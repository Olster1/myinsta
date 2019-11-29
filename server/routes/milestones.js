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
			if(documentResult != null) {

				const milestone = new milestoneModel({
					objective: req.body.objective,
					type: req.body.type,
					planId: planId,
					content: req.body.content,
					depth: req.body.depth,
					childrenIds: []
				});

				milestone.save((err, result) => {
					if(err) {
						console.log("was error");
						httpRes.json({
							result: constants.ERROR,
							data: {},
							message: 'error saving',
						});
					} else {
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

router.post('/deleteMilestone', checkToken, (req, httpRes, next) => {
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