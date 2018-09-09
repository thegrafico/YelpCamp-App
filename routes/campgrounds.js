//===========================CAMPGROUNDS ROUTES=========================
var express = require("express");
var router = express.Router();
var CampgroundsDB = require("../models/campground");

//request Middleware (Index.js is a special name, we dont have to writing);
var middleware = require("../middleware");

//INDEX -- show all campgrounds
router.get("/", function(req, res){
	//for debugging - stop the program and you can test the variables
	//eval(require('locus'));

	//----------------VAR FOR PAGINATION----------------
	// number of element per page
	var perPage = 8; 
	//no tengo ni puta idea que hace esto pero lo vi en stackOverflow
	var pageQuery = parseInt(req.query.page); 	
	//este es un if, else statement pero tampoco tengo puta idea de que hace
	var pageNumber = pageQuery ? pageQuery : 1;
	//--------------------------------------------------	
		
	if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        CampgroundsDB.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            CampgroundsDB.count({name: regex}).exec(function (err, count) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if(allCampgrounds.length < 1) {
                        req.flash("error", "Campground no found");
                        return res.redirect("back");
                    }
                    res.render("campgrounds/index", {
                        campgrounds: allCampgrounds,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        search: req.query.search
                    });
                }
            });
        });
	}else{
		
		//get all campgrounds in the DB
		CampgroundsDB.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, campgroundsFromDB){
			CampgroundsDB.count().exec(function (err, count) {
				if(err){
					console.log(err);
				}else{
					res.render("campgrounds/index", {
						campgrounds:campgroundsFromDB, 
						currentUser: req.user, 
						current: pageNumber,
						pages: Math.ceil(count/perPage)
					});
				}
			});	
		});
	}
});

//POST NEW CAMPGROUND
router.post("/",middleware.isLoggedIn,function(req, res){
	//get the data from the POST REQUEST in new compgrounds
	var nameF 			= req.body.name,
		 imageF 			= req.body.image,
		 descriptionF 	= req.body.description,
		 priceF 			= req.body.price;
		 
	 //create the user relation
	 var author = {
	 	id: req.user._id,
	 	username:req.user.username
	}
	//created new objet campgrounds
	var newCampGrounds = {name: nameF, price: priceF, image: imageF, description: descriptionF, author: author};
	
	console.log(req.user);
	//create new campgrounds and save to a DB
	CampgroundsDB.create(newCampGrounds, function(err, newCamp){
		if(!err){
			console.log("New Camp Added", newCamp);
			//redirect to campgrounds page
			res.redirect("campgrounds");
		}else{
			console.log(err);
		}
	});
});

//CREATE NEW CAMPGROUND 
router.get("/new", middleware.isLoggedIn,function(req, res){
	res.render("campgrounds/new.ejs");
});

//NEW ROUTE to SHOW info of just one element clicked
router.get("/:id", function(req, res){

	//get the element in the DB with the ID que queramos
	CampgroundsDB.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(!err){
			//see the object
			//console.log(foundCampground);
			//Go to the page show.ejs
			res.render("campgrounds/show", {campgrounds: foundCampground});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
		
		CampgroundsDB.findById(req.params.id, function(err, foundCampground){
				if(err){
					req.flash("error", "Campground no found");
				}

				res.render("campgrounds/edit", {campground: foundCampground});
		});
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership ,function(req, res){
	//findAndUpdate the correct campground
	CampgroundsDB.findByIdAndUpdate(req.params.id, req.body.data, function(err, updatedCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			//redirect somewhere
			res.redirect("/campgrounds/" + updatedCampground._id);
		}
	});
});

//REMOVE CAMPGROUND
router.delete("/:id",middleware.checkCampgroundOwnership ,function(req, res){
	CampgroundsDB.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});

//security
function escapeRegex(text) {
   return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


//exportando todas las rutas
module.exports  = router;