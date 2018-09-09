//Esto es para prueba, este archivo crea ejemplos de prueba en la DB

var mongoose = require("mongoose");//Require DB
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");

//the date we gonna enter
var data = [
	{
		name: "Linda foto", 
		image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0ce158b35d2fba5cbd3fabff7413ca9d&auto=format&fit=crop&w=500&q=60",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non ad deserunt tempora suscipit hic necessitatibus, vero incidunt. Doloremque, facere voluptatum qui autem ratione unde et, pariatur. Necessitatibus, veniam, eos. Alias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis autem dolore rerum ab aliquam ullam, nostrum aliquid, eos nulla distinctio veritatis minus aspernatur mollitia? Sed voluptates totam provident tenetur illum."
	},
	
	{
		name: "What a beauty", 
		image: "https://images.unsplash.com/photo-1531329818183-bba7e80bfecd?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c5097f919b03b7675d1c4a6034b37edb&auto=format&fit=crop&w=500&q=60",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non ad deserunt tempora suscipit hic necessitatibus, vero incidunt. Doloremque, facere voluptatum qui autem ratione unde et, pariatur. Necessitatibus, veniam, eos. Alias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis autem dolore rerum ab aliquam ullam, nostrum aliquid, eos nulla distinctio veritatis minus aspernatur mollitia? Sed voluptates totam provident tenetur illum."
	},

	{
		name: "full color", 
		image: "https://images.unsplash.com/photo-1531369201-4f7be267b1de?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5b707f3781b0b634c3cd0832f6f23f76&auto=format&fit=crop&w=500&q=60",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non ad deserunt tempora suscipit hic necessitatibus, vero incidunt. Doloremque, facere voluptatum qui autem ratione unde et, pariatur. Necessitatibus, veniam, eos. Alias.Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis autem dolore rerum ab aliquam ullam, nostrum aliquid, eos nulla distinctio veritatis minus aspernatur mollitia? Sed voluptates totam provident tenetur illum."
	}
	
];

function seedDB(){
		
	//delete everithing from the DB
	Campground.remove({}, function(err){
		if(!err){
			console.log("remove campgrounds");

			//Add new campgrounds |se pone aqui porque si lo ponemos en otro lado puede que no funcione properly
			data.forEach(function(seed){
				Campground.create(seed, function(err, campground){
					if(!err){
						console.log("added a campground");
						Comment.create({
							text: "This place is great, but I wish there was internet",
							author: "Homer" 
						}, function(err, comment){
							if(!err){
								campground.comments.push(comment);
								campground.save();
								console.log("created new Comment");
							}
						});
					}
				});
			});
		}
	});
}


//exportar nuestra funcion seedDB
module.exports = seedDB;