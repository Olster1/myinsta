const mongoose = require('mongoose');

 const articleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	}

	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},

});

 articleSchema.pre('save', function(next){
     now = new Date();

     this.updated_at = now;
     this.created_at = now;

     next();
 });


module.exports = mongoose.model('Article', articleSchema);
