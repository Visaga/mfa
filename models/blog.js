const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const BlogSchema = new Schema ({
    title: {type: String, require: true},
	createdDate: Date,
	modifiedDate: Date,
	urlExtention: {type: String, require: true},
	published: Boolean,
	category: String,       // NEED TO ADD SEARCH BY CATEGORY AND SHOW ONLY IF PUBLISHED TRUE
	views: {
		unic:{type: Number, default: 0},
		all: {type: Number, default: 0}
	},
	
	content: {type: [{
		subtitle: String,
		text: String,
		img: String,
		alt: String
	}], require: true},
	seo: {
		title: String,
		description: String,
		keywords: String,
		
	}
	
});



module.exports = mongoose.model("Blog", BlogSchema);