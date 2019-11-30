const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const mongodb = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt  = require('bcrypt');

const { checkToken } = require('./utils/auth.js')

//NOTE(ol): global path like .exe path in game programming
const path = require('path');
//

///////////////////////************ ROUTERS *************////////////////////

const userRouter = require(path.resolve(__dirname, 'routes/user.js'))
const checkoutRouter = require(path.resolve(__dirname, 'routes/checkout.js'))
const learningPlanRouter = require(path.resolve(__dirname, 'routes/learningPlans.js'))
const milestoneRouter = require(path.resolve(__dirname, 'routes/milestones.js'))

////////////////////////////////////////////////////////////////////

const listModel = require(path.resolve(__dirname, 'models/list.js'));
const userModel = require(path.resolve(__dirname, 'models/users.js'));

if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	const result = require('dotenv').config();
	// console.log(result);

} 

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

///////////////////////*********** Assign routers **************////////////////////

app.use('/user', userRouter);

app.use('/learningPlans', learningPlanRouter);

app.use('/checkout', checkoutRouter);

app.use('/milestone', milestoneRouter);


////////////////////////////////////////////////////////////////////


app.post('/getAllTodos', (req, res, next) => {
	listModel.find({}, (error, result) => {
		if(error) {
			next(error);
		}
		res.json(result);
	});
});



app.post('/getSecretMessage', checkToken, (req, res, next) => {
	//NOTE(ol): Has gone through our middleware so token is valid
	console.log("USERNAME: " + req.email);

	res.json({
		successful: true,
		reason: 'got message',
		message: 'Priates are attacking NOW!'
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


//Handle all other request

app.get('/*', (req, res) => {
	res.sendFile(path.resolve(__dirname, "../app/public/index.html"));
});


//error handles
app.use((error, req, res, next) => {
	console.log(error);
	res.status(500).json({
		result: 'ERROR',
		data: {},
		message: "something went wrong"
	});
});

//404 error

app.use((req, res, next) => {
	res.sendStatus(404);
});


app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
