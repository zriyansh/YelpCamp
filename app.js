var path 			= require("path"),
	flash			= require("connect-flash"),
	express  		= require("express"),
	app  			= express(),
	mongoose  		= require("mongoose"),
	request  		= require("request"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	methodOverride  = require("method-override"),
	bodyParser  	= require("body-parser"),  
	Campground 		= require("./models/campground"),
	Comment 		= require("./models/comment"),
	User 			= require("./models/user"),
	seedDB 			= require("./seeds");

// Requiring routes from other files.
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v", { useUnifiedTopology: true});
 
app.use(flash())
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"))

app.use(require("express-session")({
	secret: "this is a secret message!",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// Middleware to authenticate user on every page(ejs)
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	// Error and Success are just variables
	next();
})


app.use("/", indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)
// We could use these also to shorten the urls of respective routes

// START THE LOCALHOST
app.listen(3500, function(){
	console.log("Starting port 3500  - YelpCamp");
});
