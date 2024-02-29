import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/fileupload.js";

const registerUser = asyncHandler(async (req, res) => {
	// 1. Get data from the frontend
	const { name, email, password } = req.body;

	// 2. check if any input was empty
	const anyFieldEmpty = [name, email, password].some((field) => {
		return field?.trim() === "";
	});
	if (anyFieldEmpty) {
		throw new ApiError(400, "All fields are required");
	}
	// you can insert other validations as well

	// 3. Check if user already exist or not
	const foundUser = User.findOne({
		email: email,
	});
	if (foundUser) {
		throw new ApiError(409, "Email already registered");
	}

	// 4. handle user profile photo/avatar
	const avatarLocalPath = req.file?.path;
	let avatar = { url: null };
	if (avatarLocalPath) {
		avatar = await uploadToCloudinary(avatarLocalPath);
		if (!avatar) {
			throw new ApiError(
				500,
				"Error uploading profile photo. Please try again!!"
			);
		}
	}

	// 5. create and save user to database
	const createdUser = await User.create({
		name,
		password,
		avatar: avatar.url,
		email: email.toLowerCase(),
	});

	// we are checking if user creation was successful by finding the above user in db and
	// if found we are removing password and refreshtoken field from the createdUser to pass to frontend
	const user = await User.findById(createdUser._id).select(
		"-password -refreshToken"
	);

	// now check if we were able to find the user
	if (!user) {
		throw new ApiError(500, "Something went wrong while registering the user");
	}

	// user sucessfully created and verfied, ready to send response to user
	return res
		.status(201)
		.json(new ApiResponse(200, user, "User registered successfully"));
});

export { registerUser };
