const mongoose = require('mongoose');

 const LearningPlanSchema = new mongoose.Schema({
	objective: {
		type: String,
		required: true
	},
	isPublic: {
		type: Boolean,
		required: true
	},
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},

	ownerIds: {
		type: [mongoose.Schema.Types.ObjectId],
		required: true
	},

	items: []
});

 LearningPlanSchema.pre('save', function(next){
     now = new Date();

     this.updated_at = now;
     this.created_at = now;

     next();
 });


module.exports = mongoose.model('LearningPlan', LearningPlanSchema);

