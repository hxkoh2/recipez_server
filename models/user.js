// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UserSchema = new mongoose.Schema({
	name: String,
	email: String, //users can login by email and password, no need for username
	password: String,
	recipes: [String], //store recipe id's
	tags: [String],
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
