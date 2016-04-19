// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var RecipeSchema = new mongoose.Schema({
	name: String,
	image: {type: String, default: ''},
	description: {type: String, default: ''},
	ingredients: [{name: String, quantity: Number, unit: String}],
	directions: [String],
	time: Number, //in minutes
	cost: Number, //in dollars
	tags: [String],
	reviews: [{username: String, content: String, userid: String}] //Store user's name and not id? 
});

// Export the Mongoose model
module.exports = mongoose.model('Recipe', RecipeSchema);
