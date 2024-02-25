import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name cannot be empty"],
			trim: true,
		},
		email: {
			type: String,
			required: [true, "Email cannot be empty"],
			unique: true,
			trim: true,
			index: true,
		},
		password: {
			type: String,
			required: [true, "Password cannot be empty"],
		},
		avatar: {
			type: String, // its the url of the photo
		},
		createdRecipes: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Recipe",
		},
		savedRecipes: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Recipe",
		},
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
