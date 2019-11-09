const mongoose = require('mongoose');

 const listSchema = new mongoose.Schema({
	completed: {
		type: Boolean,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	}

});

module.exports = mongoose.model('List', listSchema);
