const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");  //for Layouts
const methodOverride = require("method-override");
const path = require("path");

const blogRoutes = require("./routes/blogs.js")
let isLoggedIn = true;  // temporary

const mongoose = require("mongoose");
const Blog     = require("./models/blog.js");




app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.urlencoded({extended: true}));

app.use(methodOverride("_method"));


app.use(express.static(path.join(__dirname, "public")));  

mongoose.connect("mongodb://localhost: 27017/mfa", {
	useNewUrlParser: true, 
	useCreateIndex: true, 
	useUnifiedTopology: true,
	useFindAndModify: false
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connectionerror: "));
db.once("open", () => {
	console.log(" DataBase Connected");
})

// Blog.deleteMany({}).then(() => console.log("deleted")).catch(err => console.log(err));



// Blog.create({published: true, title: "Trying to learn how to monetize your site, These 3 types of sites consistently perform well with AdSense.",urlExtention: "hujak koty ebuchie", content: [{text: "Do you want to learn how to monetize your website with Google AdSense? If so, the most basic of Google AdSense tips are what types of sites make the most money with Google AdSense. The simplest answer is a site that has a lot of content focused on a particular topic with a high volume of traffic. But more specifically, here are the three types of sites you should aim to create if you want to earn AdSense revenue.", img: "https://lh3.googleusercontent.com/IYFXKhClOyf6dF5RBKpIDUw8LwXCHcSjLOKio63-40vxK5W6qd8RzbYUQQLO_g2WlkgWnTWZjhuVZLB9tG8uBBJj0Pu-2rfXPDLp"},{text: "If you are not comfortable with the idea of creating your own content or managing content contributors, the next best type of site to generate AdSense revenue is a forum. Forums are places people go to discuss specific topics. For example, the following is catforum.com, dedicated to cat lovers everywhere and monetized with Google AdSense.This is a highly active forum with over one million posts and over 49,000 member. Non-paying members of the site will see Google AdSense ads when they come to login and throughout their visit in discussions.When it comes to forums, you will have to create content first, but instead of lengthy blog content, you will have to create discussions and find people to start engaging with you in those discussions. Over time, more and more people will come to discuss the topic of focus, and your visitors will ultimately start clicking on ads related to that topic. Just be sure to review special AdSense policies", img: "https://www.sciencemag.org/sites/default/files/styles/article_main_image_-_1280w__no_aspect_/public/cat_1280p_0.jpg?itok=ZPUkZ5_m"}], seo: {
// 	description: "Ctoto pro Kotov",
// 	keywords: "Pets, koty , hernia"
// }})
// .then((blog) => {
// 	blog.save()
// 	console.log(blog.seo)
// })






//============ROUTES=============================


// ROUTES 
app.use("/", blogRoutes);




app.get("/", (req, res) => res.redirect("/home"));






//If page doesn't exist comes generick message 
app.all("/*", (req, res) => {
	res.status(404).send("PAGE NOT FOUND")
})



app.listen("5000", () => console.log("SERVER STARTED!!!"));
