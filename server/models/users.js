const mongoose = require('mongoose');
const bcrypt  = require('bcrypt');

 const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}

});

 const saltRounds = 10;

 UserSchema.pre('save', function(next) {
 	if (this.isNew || this.isModified('password')) {
 	    // Saving reference to this because of changing scopes
 	    const document = this;
 	    bcrypt.hash(document.password, saltRounds,
 	      function(err, hashedPassword) {
 	      if (err) {
 	        next(err);
 	      }
 	      else {
 	        document.password = hashedPassword;
 	        next();
 	      }
 	    });
 	  } else {
 	    next();
 	  }

 });

 UserSchema.statics.encrypt = function encrypt(password, cb) {
    bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
      cb(hashedPassword, err);
    });
 }


module.exports = mongoose.model('User', UserSchema);

