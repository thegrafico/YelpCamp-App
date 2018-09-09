//=================================AUTHENTICATED ROUTES======================
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user")

//home page
router.get("/", function(req, res){

	res.render("landing", {});
});

//REGISTER ROUTE - sing up
router.get("/register", function(req, res){
	res.render("register");
});

//REGISTER ROUTE HANDLE sing up
router.post("/register", function(req, res){

	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){

		//if a error occurs
		if(err){
			console.log(err);
			req.flash("error", err.message);	
			res.redirect("back");
		}else{
			console.log("User created");
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to YelpCamp " + user.username);	
				res.redirect("/campgrounds");
			});
		}
	});
});

//SHOW LOGIN FORM
router.get("/login", function(req, res){
	//send the erro message in flash message
	res.render("login");
});

//POST LOGIN - we use the midleware to autenticar el usuario
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds", //si el usuario se encuentra en la DB pues BIEN
		faiulerRedirect: "/login"	//si no se encuentra pues va aqui
	}) ,function(req, res){
});

//LOGOUT ROUTE
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;