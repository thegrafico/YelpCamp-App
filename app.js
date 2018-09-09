//import express, create app, import mongoose DB, import bodyParse.
var express 		= require('express'), //para hace http request
	app 				= express(), //para que manejemos express
	mongoose 		= require("mongoose"), //DB
	bodyParser 		= require('body-parser'), //recuperar datos a traves de URL
	CampgroundsDB 	= require("./models/campground.js"), //para usar el modelo en la base de datos
	Comment 			= require("./models/comment.js"), //para usar el modelo en la base de datos
	seedDB 			= require("./seeds.js"), //nuestro archivo seeds
	passport 		= require("passport"),	//Authentificacion
	LocalStrategy	= require("passport-local"),//autentificacion
	User 				= require("./models/user"),
	methodOverride = require("method-override"), //para realizar PUT request. EDIT AND UPDATE CAMPGROUNDS
	flash				= require("connect-flash");

//requiring ROUTEScampgrounds
var commentsRoute 	= require("./routes/comments"),
	 campgroundRoute 	= require("./routes/campgrounds"),
	 authRoutes 		= require("./routes/index")

//==========================SETUP=========================
//create connection to our DB
mongoose.connect("mongodb://localhost/yelp_camp_v12");

//tell express use body parser
app.use(bodyParser.urlencoded({extended: true}));

//para que node sepa que todos los archivos que va a cargar son .ejs
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public")); // para que use esta carpeta y podamos usar nuestro css
//console.log(__dirname);
//le decimos por parantecis que es lo que queremos buscar para sobreescribir
app.use(methodOverride("_method"));

//to use flash message
app.use(flash());
//remove all campgrounds and created again
//seedDB(); //usando la function que exportamos de el archivo seeds.js
//-------------------------------------------------------------------
//======================EXPRESS-SESSION CONFI======================

app.use(require("express-session")({
	secret: "Thegrafico is a cool guy",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Esta usando los metodos que hereda USER
passport.use(new LocalStrategy(User.authenticate()));

//encriptar datos
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//this is a midleware tha run in every route.
app.use(function(req, res, next){
	//every route got accest to variable currentUser
	res.locals.currentUser = req.user;
	//have messaje in every temple
	res.locals.error = req.flash("error"); //error mesage go red
	res.locals.success = req.flash("success"); //success message go green

	//to use the time
	res.locals.moment = require("moment");

	//move to the next function
	next();
});
//Usando nuestros archivos que dividimos
app.use(authRoutes);
app.use("/campgrounds", campgroundRoute); //el primer parametro es para que todas las rutas de campgroundRoute empiencen por esa ruta
app.use(commentsRoute);
//-------------------------------------------------------------------

//=====================================================================
//this is our server IP
app.listen(2000, process.env.IP, function(){
	console.log("YelpCam Server has Started");
});
