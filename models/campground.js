//DB references
var mongoose = require("mongoose");
//estructura
var campgroundsSchema = new mongoose.Schema({
	name: String,
	price: Number,
	image: String,
	description: String,
	createdAt:{type: Date, default: Date.now},
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

//our model to manipulate the DB
var CampgroundsDB = mongoose.model("Campgrounds", campgroundsSchema);

module.exports = CampgroundsDB;	