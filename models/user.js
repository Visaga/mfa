const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const Blog = require("./blog");


const UserSchema = new Schema ({
	email: {
		type: String, 
		require: true,
		unique: true
	}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);	
