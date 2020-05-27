var Campground = require("../models/campground");
var Comment = require("../models/comment");

// All the middlewares goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
			Campground.findById(req.params.id, function(err, foundCampground){
				if (err) {
					req.flash("error", "Campground not found")
					res.redirect("back")
				} else {
					// Does user own the campground?
					if(foundCampground.author.id.equals(req.user._id)){
						// The .equals function is used because the "id" here is mongoose object and "_id" is a string
						next(); 
						// To perform action(s) on middleware pass. 
					} else {
						req.flash("error", "permission denied")
						res.redirect("back")
					}
				}
			})
		} else {
			req.flash("error", "You need to be logged in.")
			res.redirect("back")
		}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if (err) {
					res.redirect("back")
				} else {
					// Does the User own the comment?
					if(foundComment.author.id.equals(req.user._id)){
						next();
					} else {
						req.flash("error", "Permission denied")
						res.redirect("back")
					}
				}
			})
	} else {
		req.flash("error", "You need to be logged in")
		res.redirect("back")	
	}
}

middlewareObj.isLoggedIn  = function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	req.flash("error", "You need to be logged in")
	res.redirect("/login")
}

module.exports = middlewareObj;