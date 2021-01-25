const express = require("express");
const router = express.Router();
const User = require("../models/user");
const methodOverride = require("method-override");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
// const {campgroundSchema} = require("../schemas");     // Joi schema forserver side form validation






//  ================  REGISTER ======================
router.get("/register", (req, res) => {
	const data = {
		title: "Registar to AKT",
		seoTags: false
	}
	
	res.render("user/register",data);
});


router.post("/register", catchAsync(async(req, res, next) => {
	try{
	const { email, username, password} = req.body;
	const user = new User({email, username});
	const newUser = await User.register(user, password);
	req.login(newUser, (err)=> {
		if (err){
			return next(err);
		}
	})	
		
	req.flash("success", `Hello ${username}! Welocome to the Yelpcamp!`);
	res.redirect("/articles");
	} catch(e) { 
		req.flash("error", e.message);
		res.redirect("/register");
		return
	}
}));

//===================================================================.



//===========================LOGIN===================================
router.get("/login", (req, res) => {
	const data = {
		title: "Login to AKT",
		seoTags: false
	}
	
	res.render("user/login", data);
});


router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), catchAsync(async(req, res) => {
	req.flash("success", `Welcome Back ${req.body.username}!`);
	res.redirect("/articles");
	
}));

//===================================================================






//=========================LOGOUT=====================================
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You've been successfully logged out!");
	res.redirect("/articles");
});
//====================================================================




module.exports = router;