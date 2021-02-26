let path = require("path");


module.exports ={
	mode: "production", 
	entry: "./public/javaScripts/getAndRender.js",
	output:{
		filename: "bundle.js", 
		path: __dirname + "/public/javaScripts"
	}, 
	watch: true,
	devtool: "source-map",
	module: {}
}