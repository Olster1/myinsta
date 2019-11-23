var express = require('express')
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const constants = require('../utils/constants');
const { checkToken, checkNoToken } = require('../utils/auth');
const path = require('path');

const userModel = require(path.resolve(__dirname, '../models/users.js'));

var router = express.Router();


function initUserSession(httpRes, documentResult) {
	//CREATE TOKEN
	let token = jwt.sign({userId: documentResult._id}, process.env.MY_SECRET_KEY, { expiresIn: '24h'} );

	//STICK IT IN A COOKIE
	httpRes.cookie('jwt_token', token, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: true});

	//SEND BACK THE RESULT
	httpRes.json({
		result: constants.SUCCESS,
		data: {
			isLoggedIn: true,
			email: documentResult.email,
			_id: documentResult._id
		},
		message: 'you succesfully logged in',
	});
}


router.post('/logout', checkToken, (req, res) => {
	//delete cookie
	res.cookie('jwt_token', {}, {maxAge: 0, httpOnly: true, secure: false, overwrite: true});

	res.json({
		result: constants.SUCCESS,
		data: {},
		message: "you logged out"
	});
});



router.post('/login', checkNoToken, (req, httpRes, next) => {
	const email = req.body.email;
	const password = req.body.password;

	userModel.find({ email: email }, (err, documentResult) => {
		if(err) {
			console.log("an error");
			//NOTE(ollie): go to the express middleware to handle error
			return next(err);
		}

		if(documentResult.length > 0) {
			//NOTE(ol): user exists

			console.log(documentResult);

			const documentPassword = documentResult[0].password;

			bcrypt.compare(password, documentPassword, function(encryptError, res) {
			    if(encryptError) {
			    	httpRes.status(501).json(
			    	{
    					result: constants.ERROR,
    					data: {},
    					message: 'couldn\'t encrypt',
    				});
			    } else if(res == true) {
			    	initUserSession(httpRes, documentResult[0]);
			    } else {
			    	//DELETE TOKEN COOKIE
			    	httpRes.cookie('jwt_token', {}, {maxAge: 0, httpOnly: true, secure: false, overwrite: true});
		    		
			    	//SEND BACK RESULT
		    		httpRes.json({
		    			result: constants.FAILED,
						data: {},
						message: 'password was wrong',
		    		});
			    }
			});
		} else {
			


			//NOTE(ol): Username doesn't exist
			httpRes.json({
				result: constants.FAILED,
				data: {},
				message: 'username doesn\'t exist',
			});
		}
	});
});

router.post('/register', checkNoToken, (req, httpRes, next) => {
	const email = req.body.email;
	const password = req.body.password;

	userModel.find({ email: email }, (err, documentResult) => {
		if(err) {
			//NOTE(ollie): go to the express middleware to handle error
			return next(err);
		}

		if(documentResult.length == 0) {
			//NOTE(ol): No one has taken this username

			const newUser = new userModel({
				password: password,
				email: email
			});

			newUser.save((err, result) => {
				if(err) {
					//NOTE(ollie): go to the express middleware to handle error
					return next(err);
				}

				console.log("new user id is: " + documentResult[0]._id);

				initUserSession(httpRes, result);
			});


		} else {
			//NOTE(ol): Username is taken already
			httpRes.json({
    			result: constants.FAILED,
				data: {},
				message: 'Username is already taken',
    		});
		}
	});
});


// define the home page route
router.post('/isLoggedIn', checkToken, (req, res) => {
	console.log(req.userId);
	userModel.find({_id: req.userId}, (error, document) => {
		if(error) {
			return next(error);
		} else {
			const result = {
				_id: document._id,
				email: document.email,
				isLoggedIn: true,
			};

			res.json({
				result: constants.SUCCESS,
				data: result,
				message: 'is logged in',
			});
		}
	});

	
});

module.exports = router;