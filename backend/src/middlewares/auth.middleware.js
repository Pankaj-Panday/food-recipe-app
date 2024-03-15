import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const verifyToken = asyncHandler(async (req, res, next) => {
	try {
		const token =
			req.cookies.accessToken ||
			req.header("Authorization")?.replace("Bearer ", "");
		/* in express docs, req.header() is written as req.get() */

		if (!token) {
			throw new ApiError(401, "Unauthorized request");
		}
		const decodedTokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const userId = decodedTokenData._id;
		const foundUser = await User.findById(userId).select(
			"-password -refreshToken"
		);
		if (!foundUser) {
			throw new ApiError(401, "Invalid or expired Token");
		}
		req.user = foundUser;
		next();
	} catch (error) {
		throw new ApiError(401, error?.message || "Invalid Token");
	}
});

const optionalAuth = asyncHandler(async (req, res, next) => {
	try {
		const accessToken =
			req.cookies.accessToken || req.header("Authorization").split(" ")[1];
		if (accessToken) {
			const decodedTokenData = jwt.verify(
				accessToken,
				process.env.ACCESS_TOKEN_SECRET
			);
			const userId = decodedTokenData._id;
			const foundUser = await User.findById(userId).select(
				"-password -refreshToken"
			);
			if (!foundUser) {
				throw new ApiError(
					403,
					'Optional authentication Failed: "Invalid access token". Proceeding without authentication'
				);
			}
			req.user = foundUser;
		}
	} catch (error) {
		console.log(error.message);
	}
	next();
});

export { verifyToken, optionalAuth };
