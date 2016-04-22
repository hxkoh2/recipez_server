// Load required packages
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
// Define our beer schema
var UserSchema = new mongoose.Schema({
	name: String,
	email: String, //users can login by email and password, no need for username
	password: String,
	recipes: [String], //store recipe id's
	tags: [String],
});

UserSchema.methods.generateJWT = function () {
	var today = new Date();
	var exp = new Date(today);
	//1 day
	exp.setDate(today.getDate() + 1);	
	return jwt.sign({
		user: this,
		exp: parseInt(exp.getTime() / 1000)
	}, 'MY SECRET');
};

UserSchema.methods.validPassword = function (password) {
	return this.password == password;
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
