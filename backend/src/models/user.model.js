import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
			default: null,
		},
		createdRecipes: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Recipe",
		},
		savedRecipes: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Recipe",
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
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
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
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		}
	);
};

// hash password before saving
userSchema.pre("save", async function () {
	const user = this; // this refers to the document that is going to be saved
	if (!user.isModified("password")) {
		return;
	}
	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(user.password, saltRounds);
	user.password = hashedPassword;
});

export const User = mongoose.model("User", userSchema);
