const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt  = require('bcrypt');

//NOTE(ol): global path like .exe path in game programming
const path = require('path');
//


const listModel = require(path.resolve(__dirname, 'models/list.js'));
const userModel = require(path.resolve(__dirname, 'models/users.js'));

if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	const result = require('dotenv').config();
	// console.log(result);

} 

const SUCCESS = "SUCCESS";
const FAILED = "FAILED";
const ERROR = "ERROR";
 

const app = express();

app.use(cors());

////////////// APP INITIED //////////////////

//Logger middleware
app.use(morgan('dev'));

//json paser middleware
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/****
	STUDY: 
	Look up path.resolve vs path.join

***/

//NOTE(ol): make static files public
//NOTE(ol): This is a middleware that serves up files
//look in the app folder
const staticPath = path.resolve(__dirname, "../app/public"); //this is so the filenames are handled for linux & windows convention
app.use(express.static(staticPath));


const PORT = process.env.PORT || 8080;


//DB connect
mongoose.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true }).catch((error) => {
	console.log(error);
	console.log("couldn't connect to database");
});

///////

app.get('/*', (req, res) => {
	res.sendFile(path.resolve(__dirname, "app/index.html"));
});

app.get('/*:param', (req, res) => {
	res.sendFile(path.resolve(__dirname, "app/index.html"));
});

// app.post('/', (req, res) => {
// 	console.log(req);
// 	res.render('main', {
// 		message: process.env.MY_NAME 
// 	});
// });

// app.get('/about', (req, res, next) => {
// 	res.render('about.ejs', {
// 		message: 'This is the about page'
// 	});
// });

app.post('/getAllTodos', (req, res, next) => {
	listModel.find({}, (error, result) => {
		if(error) {
			next(error);
		}
		res.json(result);
	});
});

let checkToken = (req, res, next) => {
	const token = req.cookies.jwt_token;

	if (token) {
        jwt.verify(token, process.env.MY_SECRET_KEY, (err, decoded) => {
        	if(err) {
        		return res.status(403).json({
        			result: ERROR,
        			data: {},
        			message: 'there was an error verifying your login' 
        		});
        	} else {
        		console.log(decoded);
        		req.email = decoded.email;
        		return next();
        	}
   		});
	} else {
		return res.json({
			result: FAILED,
			data: {},
			message: 'You are not logged in' 
		});
	}
}


app.post('/getSecretMessage', checkToken, (req, res, next) => {
	//NOTE(ol): Has gone through our middleware so token is valid
	console.log("USERNAME: " + req.email);

	res.json({
		successful: true,
		reason: 'got message',
		message: 'Priates are attacking NOW!'
	});
});

app.post('/isLoggedIn', checkToken, (req, res) => {
	console.log(req.email);
	userModel.find({email: req.email}, (error, document) => {
		if(error) {
			return next(error);
		} else {
			const result = {
				_id: document._id,
				email: document.email,
				isLoggedIn: true,
			};

			res.json({
				result: SUCCESS,
				data: result,
				message: 'is logged in',
			});
		}
	});

	
});

app.post('/logout', checkToken, (req, res) => {

	//delete cookie
	res.cookie('jwt_token', {}, {maxAge: 0, httpOnly: true, secure: false, overwrite: true});

	res.json({
		successful: true,
		reason: 'you logged out',
	});
});



app.post('/login', (req, httpRes, next) => {
	const email = req.body.email;
	const password = req.body.password;

	userModel.find({ email: email }, (err, documentResult) => {
		if(err) {
			//NOTE(ollie): go to the express middleware to handle error
			return next(err);
		}

		if(documentResult.length > 0) {
			//NOTE(ol): user exists

			const documentPassword = documentResult[0].password;

			bcrypt.compare(password, documentPassword, function(encryptError, res) {
			    if(encryptError) {
			    	httpRes.status(501).json({
			    		successful: false,
			    		reason: "couldn't encrypt"
			    	});
			    } else if(res == true) {
			    		
			    	//CREATE TOKEN
		    		let token = jwt.sign({email: email}, process.env.MY_SECRET_KEY, { expiresIn: '24h'} );

		    		//STICK IT IN A COOKIE
		    		httpRes.cookie('jwt_token', token, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: true});

		    		//SEND BACK THE RESULT
		    		httpRes.json({
		    			successful: true,
		    			reason: "logged in successful"
		    		});
			    } else {
			    	//DELETE TOKEN COOKIE
			    	httpRes.cookie('jwt_token', {}, {maxAge: 0, httpOnly: true, secure: false, overwrite: true});
		    		
			    	//SEND BACK RESULT
		    		httpRes.json({
		    			successful: false,
		    			_id: documentResult._id,
		    			reason: "Password was wrong"
		    		});
			    }
			});
		} else {
			//NOTE(ol): Username doesn't exist
			httpRes.json({
				successful: false,
				reason: "The username doesn't exist."
			});
		}
	});
});

app.post('/register', (req, httpRes, next) => {
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

				let token = jwt.sign({email: email}, process.env.MY_SECRET_KEY, { expiresIn: '24h'} );

				httpRes.cookie('jwt_token', token, {maxAge: 90000000, httpOnly: true, secure: false, overwrite: true});

				httpRes.json({
					successful: true,
					_id: result._id,
					reason: "User created"
				});

			});


		} else {
			//NOTE(ol): Username is taken already
			httpRes.json({
				successful: false,
				reason: "This username is taken."
			});
		}
	});
});


app.post('/addTodo', (req, res, next) => {
	//NOTE(ol): doing it using save, we run mongooses prehooks listed in save 
	const newTodo = new listModel({
		completed: false,
		name: req.body.name,
		description: req.body.description,
	});


	newTodo.save((error, result) => {
		console.log(result);
		console.log("result");
		if(error) {
			return next(error);
		}

		res.json(result);
	});
});

app.post('/alterTodo', (req, res, next) => {
	const id = req.body.id;

	const value = req.body.value;

	listModel.updateOne({_id: id}, { $set: { completed: value } }, {multi: false}, (error, result) => {
		if(error) {
			return next(error);
		}
		console.log(result);

		res.json({
			success: true
		});
	});
});


//error handles
app.use((error, req, res, next) => {
	console.log(error);
	res.status(500).send({
		successful: false,
   		reason: 'This is an error!'
	});
});

//404 error

app.use((req, res, next) => {
	res.sendStatus(404);
});


app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
