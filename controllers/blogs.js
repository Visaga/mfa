
const Blog = require("../models/blog");
const  { isAuthor}  = require("../middleware");
const ExpressError = require("../utils/ExpressError");



module.exports.index = async(req, res, next) => {

	if (req.query.search){
		
		const regex = new RegExp(escapeRegex(req.query.search), "gi");
		
		const allBlogs = await Blog.find( {title: regex, published: true});
		
	const data = {
	  allBlogs, 
		title: "Буду Знать - Интересные и познавательные публикации.",
		seoTags: false,
		query: req.query.search
	}
	
	

	res.render("home", data );
		
	}else {

	const allBlogs = await Blog.find({published: true});
	const data = {
	  allBlogs: allBlogs.reverse(), 
		title: "Буду Знать - Интересные и познавательные публикации.",
		seoTags: {
			  canonical: true,
			  url: "http://www.buduznat.ru/articles",
			  published: false,
			  modified: false,
			  type: "website",
			  description: "Буду Знать это веб-ресурс на котором публикуются статьи разной тематики. Все публикации информативны, красиво оформлены, дополнены иллюстрациями и легко читаются. На сайтеесть такие категории как «Путешествия», «Семья и отношения» и многие другие.", 
			  keywords: "Буду Знать, Путешествия, Семья и отношения,  статьи разной тематики",
			  robots: "index, follow",
			  image: allBlogs[0].content[0].img	
		}
	}

	res.render("home", data );
}	
}


// unpublished
module.exports.unpublished = async(req, res ) => {
	
	const allBlogs = await Blog.find({published: false});
		const data = {
	    	allBlogs, 
		    title: "AKT Unpublished",
		   seoTags: false
		 }
		
		console.log(data)
	res.render("home", data);
	
}


//new

module.exports.renderNewForm = (req, res, next) => {
	const data = {  
		title: "AKT Create NEW",
	   seoTags: false
	 }
	
	res.render("new", data);
}




module.exports.submitNewBlog = async(req, res) => {


	const newBlog =  new Blog(req.body.blog);

	newBlog.images = req.files.map( file => ({url: file.path, filename: file.filename, originalName: file.originalname}) );
	
	newBlog.author = req.user._id;
	newBlog.createdDate = new Date();
	newBlog.author = req.user._id;
	newBlog.views.all = 0;
	newBlog.views.unic = 0;
	
	await newBlog.save();
	
	  req.flash("success", "Successfully created blog!");
	
	res.redirect(`/articles/${ newBlog.urlExtention.replace(/ /g, "-") }/${ newBlog._id }`);
}



//edit
module.exports.renderEditForm = async(req, res) => {

	const blog = await Blog.findById(req.params.id);

	const data = { 
		blog,
		title: "EDIT",
	    seoTags: false
	 }
	res.render("edit",  data);	
}


module.exports.submitEditForm = async( req, res, next)  => {
	
	
	   req.body.blog.modifiedDate = new Date();
	   const blog = await Blog.findByIdAndUpdate( req.params.id, req.body.blog );
		
	const newImages = req.files.map( file => ({url: file.path, filename: file.filename, originalName: file.originalname}) );
	blog.images.push(...newImages);
	
	
	await blog.save();
	
	const  updated = await Blog.findById(req.params.id);	
	
     	req.flash("success", "BLOG HAS BEEB UPDATED")
	res.redirect("/articles/" + updated.urlExtention.replace(/ /g, "-") + "/" + req.params.id);
		
}
	




	
module.exports.show = async(req, res, next) => {
	
	
	const foundPage = await Blog.findById(req.params.id).populate("author")
	 if (!foundPage) {
        req.flash('error', 'Cannot find that page!');
        return res.redirect('/articles');
    }
	

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
			  seoTags: {
					  canonical: true,
					  url: `http://www.buduznat.ru/articles/${req.params.urlextention}/${req.params.id}`,
					  published: foundPage.createdDate,
					  modified: foundPage.modifiedDate,
					  type: "article",
					  description: foundPage.seo.description, 
					  keywords: foundPage.seo.keywords,
					  robots: "index, follow",
					  image: foundPage.content[0].img 
		},
			  title: foundPage.seo.title,
			 
		  };
	
		if ( foundPage.published == true){
			
			/////////////////////////////////counting views
			if (req.session[req.params.id]){
		         foundPage.views.all += 1;
	           } else {
		        req.session[req.params.id] = 1;
				foundPage.views.unic += 1
				foundPage.views.all += 1;
	        }
			
			Blog.findByIdAndUpdate( req.params.id, foundPage).catch(err => console.log("fail to count"));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
			res.render("show", data );
		} else {
			if (req.isAuthenticated()){
			res.render("show", data);
			} else {
				req.flash("error", "We are currently updating information at this page.  Please try again later..")
				res.redirect("/articles");
			}
		}
		
			
}


//ajax lazyLoad
module.exports.lazyLoadRequest = async(req, res, next) => {

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
}

module.exports.deleteBlog = async(req, res) => {
	
		await Blog.findByIdAndRemove(req.params.id);
	     req.flash("error", "Blog has been DELETED")
		res.redirect("/articles");
}



function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}