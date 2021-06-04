var express = require('express')
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const constants = require('../utils/constants');
const { checkToken } = require('../utils/auth');
const path = require('path');

var router = express.Router();

if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	const result = require('dotenv').config();
	// console.log(process.env.MY_SECRET_STRIPE_KEY)
} 

const stripe = require('stripe')(process.env.MY_SECRET_STRIPE_KEY);



//NOTE(ollie): We create a payment intent. This is telling stripe we are playing to pay for
//			   something. So this is how much, and then we are going to send you the details directly from the
//			   client using the secret key. 

router.post('/membership', checkToken, (req, res, next) => {
	let amount = 0; //dollars
	console.log(req.body.paymentType);
	switch(req.body.paymentType) {
		case 'level0': {
			amount = 5;
			console.log(amount);
		} break;  
		case 'level1': {
			amount = 10; 
		} break;
		case 'level2': {
			amount = 100;
		}  break;
		default: {

		}
	}
	amount *= 100; //convert to dollars

	if(amount > 0) {
		console.log("creating payment intent");

		stripe.paymentIntents.create({
	    	amount: amount,
	    	currency: 'aud',
	  	}).then((intent) => {
	  		console.log(intent);
	  		console.log(constants.SUCCESS);
			res.json({
				result: constants.SUCCESS,
				data: {
					client_secret: intent.client_secret 
				},
				message: "you started a payment"
			});
		}).catch((err) => {
	  		console.log(err);
	  		return next(err);
		});
	} else {
		res.json({
			result: constants.FAILED,
			data: {
				
			},
			message: "membership not stated"
		});
	}
});

///////////////////////*********** Web Hook **************////////////////////

//On web hooks update info to the database since we now know the payment went through etc. 
//Can also activate a shipping ticket or something like that.   

////////////////////////////////////////////////////////////////////


module.exports = router; 