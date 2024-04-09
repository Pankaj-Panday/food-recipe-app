import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {
	removeFromCloudinary,
	uploadToCloudinary,
} from "../utils/remoteFileManage.js";
import { removeLocalFile } from "../utils/localFileManage.js";
import jwt from "jsonwebtoken";

async function generateTokens(userId) {
	try {
		const user = await User.findById({ _id: userId });
		const accessToken = user.generateAccessToken();
		const refreshToken = user.generateRefreshToken();
		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false }); // no need for validation here since we just updated refereshToken from backend itself
		return { accessToken, refreshToken };
	} catch (error) {
		throw new ApiError(
			500,
			"Something went wrong while generating tokens",
			error
		);
	}
}

const registerUser = asyncHandler(async (req, res) => {
	// 1. Get data from the frontend
	// 2. check if any above fields are present & input isn't empty
	// 3. Check if user already exist or not
	// 4. upload user profile photo/avatar from local server to cloudinary
	// 5. create and save user to database
	// 6. Send response to user

	const { name, email, password } = req.body;
	const avatarLocalPath = req.file?.path;
	const anyFieldEmpty = [name, email, password].some((field) => {
		return !field || field?.trim() === "";
	});
	if (anyFieldEmpty) {
		throw new ApiError(400, "All fields are required");
	}
	// you can insert other validations as well
	const foundUser = await User.findOne({
		email: email,
	});
	if (foundUser) {
		removeLocalFile(avatarLocalPath);
		throw new ApiError(409, "Email already registered");
	}
	let avatar;
	if (avatarLocalPath) {
		avatar = await uploadToCloudinary(avatarLocalPath);
		if (!avatar) {
			await removeLocalFile(avatarLocalPath);
			throw new ApiError(
				500,
				"Error uploading profile photo. Please try again!!"
			);
		}
		// remove local file
		await removeLocalFile(avatarLocalPath);
	}
	const createdUser = await User.create({
		name,
		password,
		avatar: { url: avatar?.url || null, publicId: avatar?.public_id || null },
		email: email.toLowerCase(),
	});
	// we are checking if user creation was successful by finding the above user in db and
	// if found we are removing password and refreshtoken field from the createdUser to pass to frontend
	const user = await User.findById(createdUser._id).select(
		"-password -refreshToken"
	);
	if (!user) {
		throw new ApiError(500, "Something went wrong while registering the user");
	}
	return res
		.status(201)
		.json(new ApiResponse(200, user, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
	// 1. get data from frontend
	// 2. Check if values are provided
	// 3. check if provided user exist or not
	// 4. check if password is correct or not
	// 5. Generate access and refresh token for that user
	// 6. Save refresh token in database and send access token & refresh token to user

	const { email, password } = req.body;
	if (!email || !password) {
		throw new ApiError(400, "Email and password is required");
	}
	const foundUser = await User.findOne({ email }); // returns null if no record found
	if (!foundUser) {
		throw new ApiError(404, "Email is not registered");
	}
	const isPaswordValid = await foundUser.isPasswordCorrect(password);
	if (!isPaswordValid) {
		throw new ApiError(401, "Incorrect password");
	}
	const { accessToken, refreshToken } = await generateTokens(foundUser._id);
	const loggedInUser = await User.findById(foundUser._id).select(
		"-password -refreshToken"
	);

	const cookiesOption = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.cookie("accessToken", accessToken, cookiesOption)
		.cookie("refreshToken", refreshToken, cookiesOption)
		.json(
			new ApiResponse(
				200,
				{
					user: loggedInUser,
					accessToken,
					refreshToken,
				},
				"user logged in successfully"
			)
		);
});

const logoutUser = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	await User.findByIdAndUpdate(
		userId,
		{ $unset: { refreshToken: "" } }, // {$set: {refreshtoken: null}} also works
		{ new: true }
	);
	const cookiesOption = {
		httpOnly: true,
		secure: true,
	};
	return res
		.status(200)
		.clearCookie("accessToken", cookiesOption)
		.clearCookie("refreshToken", cookiesOption)
		.json(new ApiResponse(200, {}, "user logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
	const incomingRefreshToken =
		req.cookies.refreshToken || req.body?.refreshToken;

	if (!incomingRefreshToken) {
		throw new ApiError(401, "Unauthorized request");
	}

	const decodedTokenData = jwt.verify(
		incomingRefreshToken,
		process.env.REFRESH_TOKEN_SECRET
	);
	const userId = decodedTokenData._id;
	const foundUser = await User.findById(userId);
	if (!foundUser) {
		throw new ApiError(401, "Invalid refresh token");
	}
	if (incomingRefreshToken !== foundUser.refreshToken) {
		throw new ApiError(401, "Refresh token is either expired or used");
	}
	const cookiesOption = {
		httpOnly: true,
		secure: true,
	};
	const { accessToken, refreshToken } = await generateTokens(userId);

	return res
		.status(200)
		.cookie("accessToken", accessToken, cookiesOption)
		.cookie("refreshToken", refreshToken, cookiesOption)
		.json(
			new ApiResponse(
				200,
				{
					accessToken,
					refreshToken,
				},
				"Access token refreshed"
			)
		);
});

const getCurrentUser = asyncHandler(async (req, res) => {
	return res
		.status(200)
		.json(new ApiResponse(200, req.user, "user fetched successfully"));
});

const updateUserPassword = asyncHandler(async (req, res) => {
	const { curPassword, newPassword } = req.body;
	const userId = req.user._id;
	const foundUser = await User.findById(userId);
	const isPasswordValid = await foundUser.isPasswordCorrect(curPassword);
	if (!isPasswordValid) {
		throw new ApiError(401, "Incorrect current password");
	}
	foundUser.password = newPassword;
	await foundUser.save({ validateBeforeSave: false });
	return res
		.status(200)
		.json(new ApiResponse(200, {}, "password changed successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
	// this function was earlier allowing the email to updated but not now
	const { name } = req.body;
	if (!name) {
		throw new ApiError(400, "All fields are required");
	}
	const userId = req.user._id;
	const updatedUser = await User.findByIdAndUpdate(
		userId,
		{
			$set: {
				name,
			},
		},
		{ new: true }
	).select("-password -refreshToken");

	return res
		.status(200)
		.json(new ApiResponse(200, updatedUser, "user details updated"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
	// get new profile photo
	// find user to update in database
	// extract user's current profile picture from found user
	// if profile picture found, delete it from cloudinary
	// if no profile picture, then don't request cloudinary
	// now update user's profile to new photo
	// delete new profile photo from local server

	const avatarLocalPath = req.file?.path;
	if (!avatarLocalPath) {
		throw new ApiError(400, "missing file path");
	}
	const newAvatar = await uploadToCloudinary(avatarLocalPath);
	if (!newAvatar) {
		removeLocalFile(avatarLocalPath);
		throw new ApiError(
			500,
			"Error uploading profile photo. Please try again!!!"
		);
	}
	removeLocalFile(avatarLocalPath);
	const userId = req.user._id;
	const foundUser = await User.findById(userId);
	const oldAvatarPublicId = foundUser?.avatar?.publicId;
	if (oldAvatarPublicId) {
		const success = await removeFromCloudinary(oldAvatarPublicId);
		if (!success) {
			throw new ApiError(
				500,
				"Something went wrong while deleting file from cloudinary"
			);
		}
	}
	foundUser.avatar = { url: newAvatar?.url, publicId: newAvatar?.public_id };
	await foundUser.save({ validateBeforeSave: false });
	const updatedUser = foundUser.toObject();
	delete updatedUser.password;
	delete updatedUser.refreshToken;

	return res
		.status(200)
		.json(
			new ApiResponse(200, updatedUser, "profile photo changed successfully")
		);
});

const removeUserAvatar = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const foundUser = await User.findById(userId);
	const avatarPublicId = foundUser?.avatar?.publicId;
	if (!avatarPublicId) {
		throw new ApiError(404, "Avatar doesn't exist for user");
	}
	const success = await removeFromCloudinary(avatarPublicId);
	if (!success) {
		throw new ApiError(
			500,
			"Something went wrong while deleting file from cloudinary"
		);
	}
	foundUser.avatar = { url: null, publicId: null };
	await foundUser.save({ validateBeforeSave: false });
	return res
		.status(200)
		.json(new ApiResponse(200, {}, "profile photo removed successfully"));
});

const getUserDetails = asyncHandler(async (req, res) => {
	const userId = req.params.userId;
	const foundUser = await User.findById(userId).select(
		"-password -refreshToken"
	);
	if (!foundUser) {
		throw new ApiError(404, "user not found");
	}
	return res
		.status(200)
		.json(200, new ApiResponse(200, foundUser, "user fetched succefully"));
});

const deleteUser = asyncHandler(async (req, res) => {
	const userId = req?.user._id;
	const user = await User.findById(userId);
	const avatarPublicId = user.avatar?.publicId;
	if (avatarPublicId) {
		const success = await removeFromCloudinary(avatarPublicId);
		if (!success) {
			throw new ApiError(
				500,
				"Something went wrong while deleting user profile photo"
			);
		}
	}
	await User.findByIdAndDelete(userId);
	return res
		.status(200)
		.json(new ApiResponse(200, {}, "User deleted successfully"));
});

export {
	registerUser,
	loginUser,
	logoutUser,
	refreshAccessToken,
	updateUserPassword,
	getCurrentUser,
	updateUserDetails,
	updateUserAvatar,
	removeUserAvatar,
	getUserDetails,
	deleteUser,
};
