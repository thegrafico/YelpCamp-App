//All the middleware goes here 
var CampgroundsDB = require("../models/campground.js");
var Comment = require("../models/comment.js");

//empty object
var middlewareObj = {};

//check is the campground is own to the user
middlewareObj.checkCampgroundOwnership = function(req, res, next){
	//if user is logged in?
	if(req.isAuthenticated()){
		console.log("Is logged in");
		//find the campground in the DB
		CampgroundsDB.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground no found");
				//console.log(err);
				res.redirect("back");
			}else{

				// Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
            if (!foundCampground) {
              req.flash("error", "Item not found.");
              return res.redirect("back");
            }
				//does user own the campground?
					//console.log("found: "+ foundCampground.author.id); // is a object
					//console.log("user:"  + req.user._id); // is a string
				if(foundCampground.author.id.equals(req.user._id)){
					//show this templed and send data
					next();
				}else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}

			}
		});
	}else{
		req.flash("error", "You need to be logged in");
		//console.log("Is no logged in");
		res.redirect("back");
	}	
}

//check is the comment is own to the user
middlewareObj.checkCommentsOwnership = function(req, res, next){
	//if user is logged in?
	if(req.isAuthenticated()){
		console.log("Is logged in");
		//find the comment in the DB
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				console.log(err);
				res.redirect("back");
			}else{
				//does user own the Comment?
					//console.log("found: "+ foundCampground.author.id); // is a object
					//console.log("user:"  + req.user._id); // is a string
				if(foundComment.author.id.equals(req.user._id)){
					//show this templed and send data
					next();
				}else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to be logged in");
		//console.log("Is no logged in");
		res.redirect("back");
	}	
}

//verificate if the user is logged in
middlewareObj.isLoggedIn = function(req, res, next){
	
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}



//export the midleware
module.exports = middlewareObj;	