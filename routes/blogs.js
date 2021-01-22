const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const methodOverride = require("method-override");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const  {isLogedin}  = require("../middleware");



router.use(methodOverride("_method"));



//=====================HOME ===============================
router.get("/articles", async(req, res) => {
	
	const allBlogs = await Blog.find({published: true});
	const data = {
	  allBlogs, 
	  title: "A kak tak",
	  description: "Hello descriptions for the main page", 
	  keywords: "Keywords for index page",
	  robots: "index, follow",
	  image: allBlogs[0].content[0].img
	}

	res.render("home", data );
	
});



// ====================== ALL UNPUBLISHED ==================

router.get("/articles/unpublished", catchAsync(async(req, res, next ) => {
	
	const allBlogs = await Blog.find({published: false});
		const data = {
	    	allBlogs, 
		    title: "AKT Unpublished",
		   description: false, 
		    keywords: false, 
			robots: "noindex",
			image: false
		 }
	res.render("home", data);
	
}));






//=================== CREATE NEW BLOG/PAGE==================

router.get("/articles/new", (req, res, next) => {
	const data = {  
		title: "AKT Create NEW",
	    description: false, 
		keywords: false,
		robots: "noindex",
		image: false
	 }
	
	res.render("new", data);
});


router.post("/articles", catchAsync(async(req, res) => {
    const nowDate = new Date();
	
	
    const date = `${ nowDate.getFullYear() }-${ addZero(nowDate.getMonth() + 1 )}-${ addZero(nowDate.getDate()) }` 
	   
	function addZero(n){
		return n = n < 10 ? "0" + n : n;
	}
	
	req.body.blog.date = date;

	
	const newBlog = await new Blog(req.body.blog);
	
	newBlog.save();
	
	  req.flash("success", "Successfully created blog!");
	
	res.redirect(`/articles/${ newBlog.urlExtention.replace(/ /g, "-") }/${ newBlog._id }`);
}));




//==============EDIT=======================================
router.get("/articles/:id/edit", async(req, res, next) => {
	
	
    const blog = await Blog.findById(req.params.id);
	
	const data = {  
		blog,
		title: "EDIT" + blog.title,
	    description: false, 
		keywords: false,
		robots: "noindex",
		image: false
	 }

	res.render("edit", data);	
});



router.put("/articles/:id", catchAsync( async( req, res, next)  => {
	
	   await Blog.findByIdAndUpdate( req.params.id, req.body.blog );
		
	const  updated = await Blog.findById(req.params.id);	
	
     	req.flash("success", "BLOG HAS BEEB UPDATED")
	res.redirect("/articles/" + updated.urlExtention.replace(/ /g, "-") + "/" + req.params.id);
		
}));




//==================== SHOW INDIVIDUAL BLOG PAGE ================


router.get("/articles/:urlextention/:id", catchAsync( async(req, res, next) => {
	
	const foundPage = await Blog.findById(req.params.id);
	

			const publishedBlogs = await Blog.find({published: true});
			
			let recent = [];
			
			for ( let i = 1; i < publishedBlogs.length; i++){
				if (i == 6){
					break;
				} else {
					recent.push(publishedBlogs[publishedBlogs.length - i]);
				}
			}
	
	      const data = {
			  foundPage,
			  allBlogs: recent, 
			  title: foundPage.seo.title,
			  description: foundPage.seo.description,
			  keywords: foundPage.seo.keywords,
			  robots: "index, follow",
			  image: foundPage.content[1].img
		  };
	
		if ( foundPage.published == true){

			res.render("show", data );
		} else {
			if (req.isAuthenticated()){
			res.render("show", data);
			} else {
				req.flash("error", "We are currently updating information at this page.  Please try again later..")
				res.redirect("/articles");
			}
		}
		
			
}));



//==================AJAX GET SOME BLOGS===================

router.get("/articles/get/:getFrom/:category/:quantityRequired", catchAsync(async(req, res, next) => {

	const parametrs = req.params.category == "All"? {published: true}: {category: req.params.category, published: true};
	
	const someBlogs = await Blog.find(parametrs);
	
	let response = [];
	
	if (someBlogs.length > 0 && someBlogs.length > req.params.getFrom){		
	  	for (let i = +req.params.getFrom; i < someBlogs.length; i++){
		
			if (i != (+req.params.getFrom + +req.params.quantityRequired)){  
				response.push(someBlogs[i]); 
			} else{
				res.send(response); // if all good send required amount
				break
			}		
			if (response.length >= (someBlogs.length - req.params.getFrom)){
				res.send(response);     // if availible less then required stop after all availible pushed
				break
			};
   		}
	} else{
		res.send("0");  // if nothing availible
	}
	
}));



//==================DELETE BLOG============================

router.delete("/articles/:id", catchAsync(async(req, res) => {
	
		await Blog.findByIdAndRemove(req.params.id);
	     req.flash("error", "Blog has been DELETED")
		res.redirect("/articles");
}));






module.exports = router;