var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data = [
	{
		name: "Clouds Rest 1",
		image: "https://cdn.vox-cdn.com/thumbor/z7bKIfTyJq3ibFF7YRYSCoxH3eI=/0x0:1004x753/920x613/filters:focal(422x296:582x456):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/63710251/20150428-cloud-computing.0.1489222360.0.jpg",
		description: "blah blah blah"
	},
	{
		name: "Clouds Rest 2",
		image: "https://cdn.vox-cdn.com/thumbor/z7bKIfTyJq3ibFF7YRYSCoxH3eI=/0x0:1004x753/920x613/filters:focal(422x296:582x456):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/63710251/20150428-cloud-computing.0.1489222360.0.jpg",
		description: "blah blah blah"
	},
	{
		name: "Clouds Rest 3",
		image: "https://cdn.vox-cdn.com/thumbor/z7bKIfTyJq3ibFF7YRYSCoxH3eI=/0x0:1004x753/920x613/filters:focal(422x296:582x456):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/63710251/20150428-cloud-computing.0.1489222360.0.jpg",
		description: "blah blah blah"
	}
]

function seedDB(){
	Campground.remove({}, function(err){
	// this removes all the campgrounds
		if (err) {
			console.log(err)
		}
		console.log("removed Campgrounds")
		Comment.remove({}, function(err){
			if (err) {
				console.log(err)
			}
			console.log("removed comments")
		
			//add few campgrounds
		data.forEach(function(seed){
			Campground.create(seed, function(err, campground){
				if (err) {
					console.log(err)
				} else {
					console.log("added a campground")
					//create a comment
					Comment.create(
						{
							text: "this is false",
							author: "charlie"
						}, function(err, comment){
							if(err){
								console.log(err)
							} else{
								campground.comments.push(comment)
								campground.save();
								console.log("created new comment")
							}
						});
					}
				});
			})
		})
	})
}

module.exports = seedDB;
