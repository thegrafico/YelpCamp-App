//EL MODELO DE COOMENTS QUE ESTA EN LA BASE DE DATOS

var mongoose = require("mongoose"); //DB
 
//estructura
var commentSchema = new mongoose.Schema({
    text: String,
 
	createdAt:{type: Date, default: Date.now},
    //the author gonna be a object and only contain de important peace of data
    author: {
    	id: {
    		type: mongoose.Schema.Types.ObjectId,
    		ref: "User"
    	},
    	username: String
    }
});

//export
module.exports = mongoose.model("Comment", commentSchema);