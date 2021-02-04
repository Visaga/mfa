
const Blog = require("./models/blog");

module.exports.isLogedin = (req, res, next) => {
	if (!req.isAuthenticated()){
		req.session.returnTo = req.originalUrl;
		
		req.flash("error", "You must be signed in first!");
		return res.redirect("/login");
	}
	next();
};


module.exports.isAuthor = async(req, res, next) => {
	const {id} = req.params;
	
const blog = await Blog.findById(id);

     if (!blog.author.equals(req.user._id)){
		req.flash("error", " You dont have permition to do that!");
		
		return res.redirect("/articles/" + blog.urlextention + "/" + id);
	}
	next();
};

