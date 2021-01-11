const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const BlogSchema = new Schema ({
    title: {type: String, require: true},
	date: Date,
	urlExtention: {type: String, require: true},
	published: Boolean,
	
	content: {type: [{
		subtitle: String,
		text: String,
		img: String,
		alt: String
	}], require: true},
	seo: {
		title: String,
		description: String,
		keywords: String
	}
	
});



module.exports = mongoose.model("Blog", BlogSchema);