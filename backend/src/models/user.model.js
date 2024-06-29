import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { hashPassword } from "../utils/hashPassword.js";
import { Recipe } from "./recipe.model.js";
import { UserSavedRecipe } from "./savedRecipe.model.js";
import { Review } from "./review.model.js";

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
			minLength: [8, "Password should be at least 8 characters"],
		},
		avatar: {
			url: {
				type: String, // its the url of the photo
				default: null,
			},
			publicId: {
				type: String,
				default: null,
			},
		},
		refreshToken: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true }
);

userSchema.methods.isPasswordCorrect = async function (attemptedPassword) {
	// this refers to the current instance of the document (in this case, the User document).
	const user = this;
	const isMatch = await bcrypt.compare(attemptedPassword, user.password);
	return isMatch;
};

userSchema.methods.generateAccessToken = function () {
	const user = this;
	return jwt.sign(
		{
			_id: user._id,
			name: user.name,
			email: user.email,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			// expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
			expiresIn: 5,
		}
	);
};

userSchema.methods.generateRefreshToken = function () {
	const user = this;
	return jwt.sign(
		{
			_id: user._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			// expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
			expiresIn: 60,
		}
	);
};

// hash password before saving
userSchema.pre("save", async function () {
	const user = this; // this refers to the document that is going to be saved
	if (!user.isModified("password")) {
		return;
	}
	user.password = await hashPassword(user.password);
});

userSchema.post("findOneAndDelete", async function (userDoc) {
	// 1. delete all recipes created by that user
	// 2. delete all recipes (refrences) saved by that user
	// 3. delete all saved Recipe refrecnes to deleted recipes of user
	// 4. Delete all the reviews given by the user
	// 5. Delete all the reviews of the recipes that were created by the user.
	// 6. The 3rd step and 5th will be taken care of by post "deleteMany" pre hook of recipe schema
	const userId = userDoc._id;
	await Recipe.deleteMany({ author: userId });
	await UserSavedRecipe.deleteMany({ user: userId });
	await Review.deleteMany({ owner: userId });
});

export const User = mongoose.model("User", userSchema);
