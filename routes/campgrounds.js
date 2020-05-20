var express = require("express")
var router = express.Router()
var Campground = require("../models/campground")
var middleware = require("../middleware")

//INDEX- show all campgrounds
router.get("/", function(req, res){
	//get all campgrounds from db then render
	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err)
		} else {
			res.render("campgrounds/index", {campgrounds: allcampgrounds});
		}
	});
});

//CREATE - add new campgrounds to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add to campgrounds array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	//name and image comes from the form created 
	var newCampground = {name: name, image: image, description: description, author: author, price: price}
	//Creates a new campground and save to database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err)
		} else {
	res.redirect("/campgrounds")
	}
  });
});

//NEW - show from to create new campgrounds
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new")
});

//SHOW- show the details of a particular campground
router.get("/:id", function(req, res){
	//find the campgrounds with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		//populating comments array on campgrounds 
		if(err){
			console.log(err);
		} else {
			// render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground})
		}
	});	
});

// EDIT - campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground})
	})	
})


// UPDATE - campground 
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, user){
		if (err) {
			res.redirect("/campgrounds")
		} else {
			// redirect to show page
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
})

// DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if (err) {
			res.redirect("/campgrounds")
		} else {
			res.redirect("/campgrounds")
		}
	})
})

module.exports = router