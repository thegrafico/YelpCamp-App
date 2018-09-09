//=================== COMMENTS - Nested routes=========================
var express = require("express");
var router = express.Router();
var CampgroundsDB = require("../models/campground");
var Comment = require("../models/comment");

//request Middleware (Index.js is a special name, we dont have to writing);
var middleware = require("../middleware");

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn,function(req, res){
	//find campground by id in the DB
	CampgroundsDB.findById(req.params.id, function(err, foundCampground){
		
		if(!err){
			res.render("comments/new.ejs", {campground: foundCampground});	
		}
	});
});

//POST THE COMMENT
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
	//find campground by Id in the DB
	CampgroundsDB.findById(req.params.id, function(err, foundCampground){
		//si ocurre un error rediret to index page
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			//console.log(req.body.comment);
			//creamos el comentario 
			Comment.create(req.body.comment, function(err, comment){
				if(!err){
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					//lo metemos en el array
					foundCampground.comments.push(comment);
					//lo guardamos en la DB
					foundCampground.save();
					//show the comment
					//console.log(comment);
					//show message
					req.flash("success", "Comment created");
					//mostramos la pagina donde se agrego el comentario
					res.redirect("/campgrounds/" + foundCampground._id);
				}else{
					req.flash("error", "Something went wrong");
				}
			});
		}
	});
});

//EDIT COMMENT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentsOwnership,function(req, res){
	//get the id of the campground
	var campground_id = req.params.id;
	//get the comment
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
			console.log(err);
		}else{
			res.render("comments/edit", {campground_id: campground_id,comment: foundComment});
		}
	});
});
//UPDATE EDIT COMMENT ROUTE
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentsOwnership ,function(req, res){
	//find the comment we gonna update
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			console.log(err);
			req.flash("error", "Comment can't be update");
			res.redirect("back");
		}else{
			req.flash("success", "Comment Updated");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentsOwnership,function(req, res){
	 //find by id and remove
	 Comment.findByIdAndRemove(req.params.comment_id, function(err){
	 	if(err){
	 		req.flash("error", "Something went wrong");
	 		console.log(err);
	 		res.redirect("back");
	 	}else{
	 		req.flash("success", "Comment deleted");
	 		res.redirect("/campgrounds/" + req.params.id);
	 	}
	 });
});


module.exports = router;
//===========================================================================