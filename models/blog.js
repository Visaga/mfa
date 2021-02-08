const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");



const ImageSchema = new Schema ({
	    filename: String,
		url: String,
		originalName: String
});

ImageSchema.virtual("thumbnail").get(function(){
	return this.url.replace("/upload", "/upload/w_200");
});

ImageSchema.virtual("desctop").get(function(){
	return this.url.replace("/upload", "/upload/w_200");
});

ImageSchema.virtual("mobile").get(function(){
	return this.url.replace("/upload", "/upload/w_200");
});


const BlogSchema = new Schema ({
    title: {type: String, require: true},
	createdDate: Date,
	modifiedDate: Date,
	urlExtention: {type: String, require: true},
	published: Boolean,
	category: String,       // NEED TO ADD SEARCH BY CATEGORY AND SHOW ONLY IF PUBLISHED TRUE
	promotion: false,
	author: {
		type: Schema.Types.ObjectId,
		ref: User
	},
	views: {
		unic:{type: Number, default: 0},
		all: {type: Number, default: 0}
	},
	images:[ImageSchema],
	content: {type: [{
		subtitle: String,
		text: String,
		img: String,
		alt: String,
		name: String
	}], require: true},
	seo: {
		title: String,
		description: String,
		keywords: String,
		
	}
	
});



module.exports = mongoose.model("Blog", BlogSchema);