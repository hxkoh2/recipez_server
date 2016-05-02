// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/user');
var Recipe = require('./models/recipe');
var bodyParser = require('body-parser');
var router = express.Router();

var expressjwt = require('express-jwt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//require('./config/passport');

//replace this with your Mongolab URL
mongoose.connect('mongodb://hanna:test@ds023490.mlab.com:23490/recipez');

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
app.use(bodyParser.json());

// All our routes will start with /api
app.use('/api', router);

//passport
app.use(passport.initialize());
var auth = expressjwt({secret: 'MY SECRET', userProperty: 'payload'});

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Go to /users and /recipes to get data', data: null});
});

//User routes
var usersRoute = router.route('/users');

usersRoute.get(function(req, res) {
	var where = eval("(" + req.query.where + ")");
	var sort = eval("(" + req.query.sort + ")");
	var select = eval("(" + req.query.select + ")");
	var skip = eval(req.query.skip);
	var limit = eval(req.query.limit);
	var count = req.query.count;

	var query = User.find(where)
	.sort(sort)
	.select(select)
	.skip(skip)
	.limit(limit);

	if(count==true || count == "true")
		query.count();

	query.exec(function(err, users){
	  	if(err)
	  		res.status(404).json({message: "Error getting users", data: err});
	  	else
	  		res.status(200).json({message: "Got users", data: users});
	})
});

usersRoute.post(function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var tags = req.body.tags;

	if(!name){
		res.status(400).json({message: "Name is required", data: null});
	}
	else if(!email){
		res.status(400).json({message: "Email is required", data: null});
	}
	else if(!password){
		res.status(400).json({message: "Password is required", data: null});
	}
	else {
		User.findOne({"email": email}, function(err, result){
			if(err)
				res.status(500).json({message: "Error adding user", data: err});
			if(result)
				res.status(409).json({message: "Email already exists", data: result});
			else{
				var user = new User();
				user.name = name;
				user.email = email;
				user.password = password;
				if(tags)
					user.tags = tags;
				user.save(function(err1) {
					if(err1)
						res.status(500).json({message: "Error adding user", data: err1});
					else
						res.status(201).json({message:"User sucessfully added!", data: user, token: user.generateJWT()});
				});
			}
		})
	}
});

usersRoute.options(function(req, res){
	res.writeHead(200);
	res.end();
});

var userRoute = router.route('/users/:user_id');

userRoute.get(function(req, res){
	User.findById(req.params.user_id, function(err, user){
		if(err || !user)
			res.status(404).json({message: "Error getting user", data: err});
		else 
			res.status(200).json({message: "Got user", data: user});
	});
});

userRoute.put(function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var recipes = req.body.recipes;
	var tags = req.body.tags;

	if(!name){
		res.status(400).json({message: "Name is required", data: null});
	}
	else if(!email){
		res.status(400).json({message: "Email is required", data: null});
	}
	else if(!password){
		res.status(400).json({message: "Password is required", data: null});
	}
	else {
		User.findById(req.params.user_id, function(err, user){
			if(err)
				res.status(500).json({message: "Error updating user", data: err});
			else if (!user)
				res.status(404).json({message: "User not found", data: null});
			else {
				user.name = name;
				user.email = email;
				user.password = password;
				if(recipes)
					user.recipes = recipes;
				if(tags)
					user.tags = tags;
				user.save(function(err1){
					if(err1)
						res.status(500).json({message: "Error updating user", data: err1});
					else
						res.status(200).json({message: "Updated user!", data: user, token: user.generateJWT()});
				});
			}
		})
	}
});

userRoute.delete(function(req, res) {
	User.findByIdAndRemove(req.params.user_id, function(err, user) {
		if(err || !user)
			res.status(404).json({message: "Error deleting user", data: err});
		else
			res.status(200).json({message: "User deleted from the database!", data: user});
	});
});

//Recipe routes
var recipesRoute = router.route('/recipes');

recipesRoute.get(function(req, res) {
	var where = eval("(" + req.query.where + ")");
	var sort = eval("(" + req.query.sort + ")");
	var select = eval("(" + req.query.select + ")");
	var skip = eval(req.query.skip);
	var limit = eval(req.query.limit);
	var count = req.query.count;

	var query = Recipe.find(where)
	.sort(sort)
	.select(select)
	.skip(skip)
	.limit(limit);

	if(count==true || count == "true")
		query.count();

	query.exec(function(err, recipes){
	  	if(err)
	  		res.status(404).json({message: "Error getting recipes", data: err});
	  	else
	  		res.status(200).json({message: "Got recipes", data: recipes});
	})
});

recipesRoute.post(function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var ingredients = req.body.ingredients;
	var directions = req.body.directions;
	var time = req.body.time;
	var cost = req.body.cost;
	var tags = req.body.tags;
	var description = req.body.description;

	if(!name){
		res.status(500).json({message: "Name is required", data: null});
	}
	else if(!time){
		res.status(500).json({message: "Time is required", data: null});
	}
	else if(!cost){
		res.status(500).json({message: "Cost is required", data: null});
	}
	else {
		var recipe = new Recipe();
		recipe.name = name;
		recipe.time = time;
		recipe.cost = cost;
		if(image)
			recipe.image = image;
		if(ingredients)
			recipe.ingredients = ingredients;
		if(directions)
			recipe.directions = directions;
		if(tags)
			recipe.tags = tags;
		if(description)
			recipe.description = description;
		recipe.save(function(err1) {
			if(err1)
				res.status(404).json({message: "Error adding recipe", data: err1});
			else
				res.status(201).json({message:"Recipe sucessfully added!", data: recipe});
		});
	}
});

recipesRoute.options(function(req, res){
	res.writeHead(200);
	res.end();
});

var recipeRoute = router.route('/recipes/:recipe_id');

recipeRoute.get(function(req, res){
	Recipe.findById(req.params.recipe_id, function(err, recipe){
		if(err || !recipe)
			res.status(404).json({message: "Error getting recipe", data: err});
		else 
			res.status(200).json({message: "Got recipe", data: recipe});
	});
});

recipeRoute.put(function(req, res) {
	var name = req.body.name;
	var image = req.body.image;
	var ingredients = req.body.ingredients;
	var directions = req.body.directions;
	var time = req.body.time;
	var cost = req.body.cost;
	var tags = req.body.tags;
	var reviews = req.body.reviews;
	var description = req.body.description;

	if(!name){
		res.status(500).json({message: "Name is required", data: null});
	}
	else if(!time){
		res.status(500).json({message: "Time is required", data: null});
	}
	else if(!cost){
		res.status(500).json({message: "Cost is required", data: null});
	}
	else {
		Recipe.findById(req.params.recipe_id, function(err, recipe){
			if(err || !recipe)
				res.status(404).json({message: "Error updating recipe", data: err});
			else {
				recipe.name = name;
				recipe.time = time;
				recipe.cost = cost;
				if(image)
					recipe.image = image;
				if(ingredients)
					recipe.ingredients = ingredients;
				if(directions)
					recipe.directions = directions;
				if(tags)
					recipe.tags = tags;
				if(reviews)
					recipe.reviews = reviews;
				if(description)
					recipe.description = description;
				recipe.save(function(err1){
					if(err1)
						res.status(404).json({message: "Error updating recipe", data: err1});
					else
						res.status(201).json({message: "Updated recipe!", data: recipe});
				});
			}
		})
	}
});

recipeRoute.delete(function(req, res) {
	Recipe.findByIdAndRemove(req.params.recipe_id, function(err, recipe) {
		if(err || !recipe)
			res.status(404).json({message: "Error deleting recipe", data: err});
		else
			res.status(200).json({message: "Recipe deleted from the database!", data: recipe});
	});
});



// UserSchema.methods.generateJWT = function () {
// 	var today = new Date();
// 	var exp = new Date(today);
// 	//1 day
// 	exp.setDate(today.getDate() + 1);
// 	return jwt.sign({
// 		_id: this._id,
// 		username: this.username,
// 		exp: parseInt(exp.getTime() / 1000)
// 	}, 'MY SECRET');
// }
passport.use(new LocalStrategy({usernameField: 'email'},function (username, password, done) {
	
	User.findOne({email: username}, function (err, user) {
		if(err)
			return done(err);
		if(!user)
			return done(null, false, {message: 'Invalid Email'});
		if(!user.validPassword(password))
			return done(null, false, {message: 'Incorrect Password'});
		return done(null, user);
	});
}));


var loginRoute = router.route('/login');

loginRoute.post(function (req, res, next) {
	if(!req.body.email || !req.body.password)
		return res.status(400).json({message: 'Please fill out all fields'});

	passport.authenticate('local', function (err, user, info) {
		if(err){
			res.status(500).json({message: 'Internal server error'});
		}
		else if(!user){
			res.status(404).json({message: info.message});
		}
		else{
			res.status(200).json({message: 'User validation successfull!', token: user.generateJWT()});
		}

	})(req, res, next);

});




// Start the server
app.listen(port);
