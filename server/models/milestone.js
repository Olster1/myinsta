///////////////////////*********** Mile stone schema **************////////////////////
const mongoose = require('mongoose');

 const MilestoneSchema = new mongoose.Schema({
	objective: {
		type: String,
		required: true
	},

	type: {
		type: String,
		required: true
	},

	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},

	planId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},

	depth: { //depth in the array - 0 for root parents and +1 for each depth down
		type: Number,
		required: true
	},

	childrenIds: {
		type: [mongoose.Schema.Types.ObjectId],
		required: false
	},

	content: {
		type: String,
		required: true
	}

	extendedInfoId: { //this is for more complex info like a protfolio item or blog post etc. 
		type: mongoose.Schema.Types.ObjectId,
		required: false
	},

});

 MilestoneSchema.pre('save', function(next){
     now = new Date();

     this.updated_at = now;
     this.created_at = now;

     next();
 });


module.exports = mongoose.model('Milestone', MilestoneSchema);

