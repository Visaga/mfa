const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const methodOverride = require("method-override");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const  {isLogedin, isAuthor}  = require("../middleware");

const multer = require("multer");
const upload = multer({dest: "uploades/"} );

const blogs = require("../controllers/blogs")



router.use(methodOverride("_method"));





//=====================HOME ===============================
router.get("/articles", catchAsync(blogs.index));



// ====================== ALL UNPUBLISHED ==================

router.get("/articles/unpublished",isLogedin, catchAsync(blogs.unpublished));






//=================== CREATE NEW BLOG/PAGE==================

router.get("/articles/new", isLogedin, blogs.renderNewForm);


router.post("/articles",isLogedin, catchAsync(blogs.submitNewBlog));




//==============EDIT=======================================
router.get("/articles/:id/edit", isLogedin, isAuthor, catchAsync(blogs.renderEditForm));



router.put("/articles/:id",isLogedin, isAuthor, catchAsync( blogs.submitEditForm));




//==================== SHOW INDIVIDUAL BLOG PAGE ================


router.get("/articles/:urlextention/:id", catchAsync( blogs.show));



//==================AJAX GET SOME BLOGS===================

router.get("/articles/get/:getFrom/:category/:quantityRequired", catchAsync(blogs.lazyLoadRequest));



//==================DELETE BLOG============================

router.delete("/articles/:id", isLogedin, isAuthor, catchAsync(blogs.deleteBlog));



module.exports = router;