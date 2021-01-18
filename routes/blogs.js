const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const methodOverride = require("method-override");
let isLoggedIn = true;  // temporary


router.use(methodOverride("_method"));



//=====================HOME ===============================
router.get("/articles", async(req, res) => {
	
	const allBlogs = await Blog.find({published: true});
		
	res.render("home", {allBlogs});
	
});



// ====================== ALL UNPUBLISHED ==================

router.get("/articles/unpublished", async(req, res) => {
	
	const allBlogs = await Blog.find({published: false});
		
	res.render("home", {allBlogs});
	
});




//=================== CREATE NEW BLOG/PAGE==================

router.get("/articles/new", (req, res) => {
	res.render("new");
});


router.post("/articles", async(req, res) => {
    const nowDate = new Date();
	
	
    const date = `${ nowDate.getFullYear() }-${ addZero(nowDate.getMonth() + 1 )}-${ addZero(nowDate.getDate()) }` 
	   
	function addZero(n){
		return n = n < 10 ? "0" + n : n;
	}
	
	req.body.blog.date = date;

	const newBlog = await new Blog(req.body.blog);
	
	newBlog.save();
	
	res.redirect(`/articles/${ newBlog.urlExtention.replace(/ /g, "-") }/${ newBlog._id }`);
});





//==============EDIT=======================================
router.get("/articles/:id/edit", async(req, res) => {
	
    const blog = await Blog.findById(req.params.id);
	
	res.render("edit", { blog });
		
});



router.put("/articles/:id",async( req, res)  => {
	try{
	
	   await Blog.findByIdAndUpdate( req.params.id, req.body.blog );
		
	const  updated = await Blog.findById(req.params.id);	
	
     	
	res.redirect("/articles/" + updated.urlExtention.replace(/ /g, "-") + "/" + req.params.id);
		
	} catch(err){
		console.error(err)
	}
});




//==================== SHOW INDIVIDUAL BLOG PAGE ================


router.get("/articles/:urlextention/:id", async(req, res) => {

	try{
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
		if (foundPage && foundPage.published == true){
			
			
			res.render("show", {foundPage, allBlogs: recent});
		} else {
			if (isLoggedIn){
				
			
			res.render("show", {foundPage, allBlogs: recent});
			} else{
				res.redirect("/")
			}
		}	
	} catch(err){
		console.error(err);
		res.redirect("/");
	}	
});



//==================AJAX GET SOME BLOGS===================

router.get("/articles/get/:getFrom/:category/:quantityRequired", async(req, res) => {

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
	
});



//==================DELETE BLOG============================

router.delete("/articles/:id", async(req, res) => {
	try{
		await Blog.findByIdAndRemove(req.params.id);
		res.redirect("/articles");
	} catch(err){
		console.log(err);
		res.redirect("/articles");
	}
});






module.exports = router;