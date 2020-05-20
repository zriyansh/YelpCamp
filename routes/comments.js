var express = require("express")
var router = express.Router({mergeParams: true})
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middleware = require("../middleware")

//COMMENTS ROUTE(nested route)

// comment new
 router.get("/new", middleware.isLoggedIn, function(req, res){
 	//findCampground by ID
 	Campground.findById(req.params.id, function(err, campground){
 		if (err) {
 			console.log(err)
 		} else {
	 		res.render("comments/new", {campground: campground});
 		}
 	})
 })

// comment create
router.post("/", middleware.isLoggedIn, function(req, res){
	//lookup for campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if (err) {
			console.log(err)
			res.redirect("/campgrounds")
		} else {
			// use object so that we dont have to declare diff var form author and comment
			Comment.create(req.body.comment, function(err, comment){
				if (err) {
					req.flash("error", "something went wrong")
					console.log(err)
				} else { 
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully created comment")

					res.redirect("/campgrounds/" + campground._id)
				}
			});
		}
	});
});

// COMMENTS EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if (err) {
			res.redirect("back")
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})

		}
	})
})

// EDITED COMMENTS(UPDATED) SHOW ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if (err) {
		 res.redirect("back")
		} else {
			res.redirect("/campgrounds/" + req.params.id)
		}

	})
})

// DELETE COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if (err) {
			res.redirect("back")
		} else {
			req.flash("success", "Successfully deleted comment")
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
})

module.exports = router