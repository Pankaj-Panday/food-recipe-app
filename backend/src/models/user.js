import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		profilePhoto: {
			type: String, // its the url of the photo
		},
		createdRecipes: {},
		savedRecipes: {},
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
