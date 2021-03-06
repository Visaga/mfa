if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}


const dbPassword = process.env.Mongo_Atlas_Password;
const mongoLogin = process.env.Mongo_login;

const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");  //for Layouts
const methodOverride = require("method-override");
const path = require("path");

const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const flash = require("connect-flash");
const session = require("express-session");


const passport = require("passport");
const localStrategy = require("passport-local");

const blogRoutes = require("./routes/blogs.js");
const usersRoutes = require("./routes/users");
let isLoggedIn = true;  // temporary

const mongoose = require("mongoose");
const Blog     = require("./models/blog.js");
const User = require("./models/user");

const compression = require("compression");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");




app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({extended: true}));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));  
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy: false}));


app.use(compression({
	level: 6,
	threshold: 0,
	filter: (req, res) => {
		if (req.headers["x-no-compression"]){
			return false;
		}
	return compression.filter(req, res);	
	}
}));


const sessionConfig = {
	name: "hlopchik",
	secret: "This should be better secret! change it",
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true, //For Security reasons
		// secure: true, //for https
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
	
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/viewcount", async(req, res) => {
	const allBlogs = await Blog.find({});
	const totalCount = {
		unic: 0,
		all: 0
	}
	
	allBlogs.forEach(blog =>{
		totalCount.unic += blog.views.unic;
		totalCount.all += blog.views.all;
	});
	res.send(totalCount.unic + " / " + totalCount.all)
});


// mongoose.connect("mongodb://localhost: 27017/mfa", {
// 	useNewUrlParser: true, 
// 	useCreateIndex: true, 
// 	useUnifiedTopology: true,
// 	useFindAndModify: false
// });

// const db = mongoose.connection;

// db.on("error", console.error.bind(console, "connectionerror: "));
// db.once("open", () => {
// 	console.log(" Local DataBase Connected");
// })


//PRODACTION DB

mongoose.connect("mongodb+srv://"+ mongoLogin +":" + dbPassword+ "@cluster0.vxx8x.mongodb.net/<dbname>?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
}).then(() => {
	console.log(" BE CAREFULL: Connected to PRODACTION DB")
}).catch(err => {
	console.log("Something whent wrong!")
    console.log(err.message)
});



app.use((req, res, next) => {
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.currentUser = req.user;
	res.locals.currentUrl = req.url;
	next();
});



//============ROUTES=============================


// ROUTES 
app.use("/", blogRoutes);
app.use("/", usersRoutes);




app.get("/", (req, res) => res.redirect("/articles"));


app.get("/err", (req, res) => {
	throw new ExpressError("Oshibka, 500", 500);
});



//If page doesn't exist comes generick message 
app.all("*", (req, res) => {
	
	
	res.status(404).render("errors/notfound", {title: "404 PAGE NOT FOUIND", seoTags: false})
})



app.use((err, req, res, next) => {
	const {message = "Oops, Something Went Wrong!", statusCode = 500} = err;
	
	if (!err.message){err.message = "Oh No, Something Went Wrong!"}
	res.status(statusCode).render("errors/error",{err, title: "Error", seoTags: false})
});



let http = require("http");
setInterval(function(){
	http.get("http://www.buduznat.ru/viewcount");
},300000)




if (process.env.NODE_ENV !== "production") {
	app.listen("5000", () => console.log("SERVER STARTED!!!"));
} else {
	app.listen(process.env.PORT, '0.0.0.0')
}

