var express = require("express")
var router = express.Router({mergeParams: true})
// mergeParams helps to retain :id in current file if we used the common parts
// of URL's in app.use() defined in app.js file
var passport = require("passport")
var User = require("../models/user")

router.get("/", function(req, res){
	res.render("landing");
});

// AUTH ROUTES

// show regsiter form
router.get("/register", function(req, res){
	res.render("register")
})

// handel Sign Up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			req.flash("error", err.message)
			// err msg are from local-mongoose-password package
			return res.render("register")
		}
		passport.authenticate("local")(req,res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username)
			res.redirect("/campgrounds")
		})
	})
})

// login form
router.get("/login", function(req, res){
	req.flash("success", "successfully logged in")
	res.render("login")
})

// login logic handeling
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}) ,function(req, res){
})

// logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "logged you out")
	res.redirect("/campgrounds")
})

module.exports = router