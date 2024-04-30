import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Recipe } from "../models/recipe.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
	removeFromCloudinary,
	uploadToCloudinary,
} from "../utils/remoteFileManage.js";
import { removeLocalFile } from "../utils/localFileManage.js";

function anyEmptyValue(...fields) {
	const isEmpty = fields.some((field) => {
		return !field || field.trim() === "";
	});
	return isEmpty;
}

function isValidArray(arr) {
	if (!Array.isArray(arr)) {
		return false;
	}
	const isInvalid = arr.some((value) => {
		return !value || value.trim === "";
	});
	return !isInvalid;
}
const createRecipe = asyncHandler(async (req, res) => {
	// get all data from frontend
	// check if any required field is empty or not and is of correct format
	// if recipe photo is provided, upload it to cloudinary
	// if photo upload it successful, remove local copy of photo
	// if photo upload fails, throw error and remove local copy of photo
	// create the recipe and save it to database
	// return response to user
	const userId = req.user._id;
	const { title, introduction, cookingTime, ingredients, steps, isPublished } =
		req.body;
	const recipePhotoLocalPath = req.file?.path;
	if (anyEmptyValue(title, cookingTime)) {
		removeLocalFile(recipePhotoLocalPath);
		throw new ApiError(400, "recipe title and cooking time can not be empty");
	}
	if (!isValidArray(ingredients) && !isValidArray(steps)) {
		removeLocalFile(recipePhotoLocalPath);
		throw new ApiError(400, "ingredients and steps aren't valid inputs");
	}
	let recipePhoto;
	if (recipePhotoLocalPath) {
		recipePhoto = await uploadToCloudinary(recipePhotoLocalPath);
		if (!recipePhoto) {
			// uploading failed
			removeLocalFile(recipePhotoLocalPath);
			throw new ApiError(500, "Error uploading photo. Please try again!!");
		}
		// upload succeded
		removeLocalFile(recipePhotoLocalPath);
	}
	// create the recipe and save to database
	const recipe = await Recipe.create({
		title,
		introduction: introduction || "",
		cookingTime: parseInt(cookingTime),
		recipePhoto: {
			url: recipePhoto?.url || null,
			publicId: recipePhoto?.public_id || null,
		},
		ingredients,
		steps,
		author: userId,
		isPublished: isPublished || false,
	});
	return res
		.status(201)
		.json(new ApiResponse(201, recipe, "Recipe created successfully"));
});

const viewRecipe = asyncHandler(async (req, res) => {
	const recipeId = req.params?.recipeId;
	if (!recipeId) {
		throw new ApiError(400, "Missing required URL parameter: recipeId");
	}
	const recipeObjectId = new mongoose.Types.ObjectId("" + recipeId);
	const pipeline = [
		{
			$match: { _id: recipeObjectId }, // [ {recipeDoc} ]
		},
		{
			$lookup: {
				from: "users",
				localField: "author",
				foreignField: "_id",
				pipeline: [
					{
						$project: { _id: 1, name: 1 },
					},
				],
				as: "author",
			},
		},
		{
			$set: { author: { $arrayElemAt: ["$author", 0] } },
		},
	];
	const recipe = await Recipe.aggregate(pipeline);
	if (!recipe?.length) {
		// empty array
		throw new ApiError(404, "Recipe does not exist");
	}

	const recipeData = recipe[0];
	// check recipe is published
	if (!recipeData?.isPublished) {
		// check if user is logged in
		const userId = req?.user._id;
		if (!userId) {
			throw new ApiError(
				403,
				"The author of recipe has unpublished the recipe. You will be able to access it once owner makes it public"
			);
		}
		// check if user is logged in and owner of recipe
		if (userId.toString() !== recipe.author._id.toString()) {
			throw new ApiError(
				403,
				"The author of recipe has unpublished the recipe. You will be able to access it once owner makes it public"
			);
		}
	}
	return res
		.status(200)
		.json(new ApiResponse(200, recipeData, "recipe fetched succesfully"));
});

const updateRecipeTextDetails = asyncHandler(async (req, res) => {
	// update text details
	const { title, introduction, cookingTime, ingredients, steps, isPublished } =
		req.body;
	const recipeId = req.params?.recipeId;
	if (!recipeId) {
		throw new ApiError(400, "Missing required URL parameter: recipeId");
	}
	const userId = req.user._id;
	if (anyEmptyValue(title, cookingTime)) {
		throw new ApiError(400, "title and cookingTime cannot be empty");
	}
	if (!isValidArray(ingredients) || !isValidArray(steps)) {
		throw new ApiError(400, "ingredients and steps are not valid inputs");
	}
	const recipe = await Recipe.findById(recipeId);
	if (!recipe) {
		throw new ApiError(404, "Recipe doesn't exist");
	}
	if (recipe.author.toString() !== userId.toString()) {
		throw new ApiError(403, "You are not authorized to perform this action");
	}

	recipe.title = title;
	recipe.introduction = introduction || "";
	recipe.cookingTime = parseInt(cookingTime);
	recipe.ingredients = ingredients;
	recipe.steps = steps;
	recipe.isPublished = Boolean(isPublished) || false;

	await recipe.save();

	return res
		.status(200)
		.json(new ApiResponse(200, recipe, "Recipe details updated successfully"));
});

const updateRecipePhoto = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const recipeId = req.params?.recipeId;
	if (!recipeId) {
		throw new ApiError(400, "Missing required URL parameter: recipeId");
	}
	const newPhotoLocalPath = req?.file?.path;
	if (!newPhotoLocalPath) {
		throw new ApiError(400, "missing recipe photo local path");
	}
	const recipe = await Recipe.findById(recipeId);
	if (!recipe) {
		removeLocalFile(newPhotoLocalPath);
		throw new ApiError(404, "Recipe doesn't exist");
	}
	if (recipe.author.toString() !== userId.toString()) {
		removeLocalFile(newPhotoLocalPath);
		throw new ApiError(403, "You are not authorized to perform this action");
	}
	const newPhoto = await uploadToCloudinary(newPhotoLocalPath);
	if (!newPhoto) {
		removeLocalFile(newPhotoLocalPath);
		throw new ApiError(500, "Something went wrong while uploading new photo");
	}
	removeLocalFile(newPhotoLocalPath);
	const oldPhotoPublicId = recipe?.recipePhoto?.publicId;
	if (oldPhotoPublicId) {
		// remove old photo from cloudinary
		const success = await removeFromCloudinary(oldPhotoPublicId);
		if (!success) {
			throw new ApiError(500, "Something went wrong while deleting old photo");
		}
	}
	recipe.recipePhoto = { url: newPhoto?.url, publicId: newPhoto.public_id };
	await recipe.save();
	return res
		.status(200)
		.json(new ApiResponse(200, recipe, "Recipe photo updated succesfully"));
});

const deleteRecipePhoto = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const recipeId = req.params?.recipeId;
	if (!recipeId) {
		throw new ApiError(400, "Missing required URL parameter: recipeId");
	}
	const recipe = await Recipe.findById(recipeId);
	if (!recipe) {
		throw new ApiError(404, "Recipe doesn't exist");
	}
	if (recipe.author.toString() !== userId.toString()) {
		throw new ApiError(403, "You are not authorized to perform this action");
	}
	const recipePhotoPublicId = recipe?.recipePhoto?.publicId;
	if (!recipePhotoPublicId) {
		throw new ApiError(404, "Recipe photo doesn't exist");
	}
	const success = await removeFromCloudinary(recipePhotoPublicId);
	if (!success) {
		throw new ApiError(500, "Something went wrong while deleting photo");
	}
	recipe.recipePhoto = { url: null, publicId: null };
	await recipe.save({ validateBeforeSave: false });

	return res
		.status(200)
		.json(new ApiResponse(200, {}, "recipe photo deleted successfully"));
});

const deleteRecipe = asyncHandler(async (req, res) => {
	const recipeId = req.params?.recipeId;
	const userId = req.user._id;
	if (!recipeId) {
		throw new ApiError(400, "Missing required URL parameter: recipeId");
	}
	const recipe = await Recipe.findById(recipeId);
	if (!recipe) {
		throw new ApiError(404, "Recipe doesn't exist");
	}
	if (recipe.author.toString() !== userId.toString()) {
		throw new ApiError(403, "You aren't authorized to perform this action");
	}
	const recipePhotoPublicId = recipe.recipePhoto?.publicId;
	if (recipePhotoPublicId) {
		const success = await removeFromCloudinary(recipePhotoPublicId);
		if (!success) {
			throw new ApiError(500, "Something went wrong while deleting photo");
		}
	}
	await Recipe.findByIdAndDelete(recipeId);
	return res
		.status(200)
		.json(new ApiResponse(200, {}, "Recipe deleted successfully"));
});

const getAllRecipes = asyncHandler(async (req, res) => {
	const pipeline = [
		{
			$match: { $expr: { $eq: ["$isPublished", true] } },
		},
		{
			$lookup: {
				from: "users",
				localField: "author",
				foreignField: "_id",
				pipeline: [
					{
						$project: { name: 1 },
					},
				],
				as: "author",
			},
		},
		{
			$set: { author: { $arrayElemAt: ["$author", 0] } },
		},
		{
			$project: {
				title: 1,
				cookingTime: 1,
				recipePhoto: 1,
				author: 1,
				avgRating: 1,
				totalReviews: 1,
			},
		},
	];
	const recipeAggregate = Recipe.aggregate(pipeline);
	const options = {
		page: parseInt(req.query.page) || 1,
		limit: parseInt(req.query.limit) || 10,
	};
	const result = await Recipe.aggregatePaginate(recipeAggregate, options);

	const response = {
		recipes: result.docs,
		totalRecipeCount: result.totalDocs,
		recipesPerPage: result.limit,
		curPageNum: result.page,
		totalPages: result.totalPages,
		hasPrevPage: result.hasPrevPage, // boolean
		hasNextPage: result.hasNextPage, // boolean
		prevPageNum: result.prevPage, // page number or null
		nextPageNum: result.nextPage, // page number or null
	};

	res
		.status(200)
		.json(new ApiResponse(200, response, "recipes fetched successfully"));
});

const getFourRandomRecipes = asyncHandler(async (req, res) => {
	const latestRecipes = await Recipe.find({ isPublished: true })
		.limit(4)
		.select("title author cookingTime recipePhoto avgRating totalReviews")
		.populate({
			path: "author",
			select: { name: 1 }, // select only name field from author (_id is by default)
		});

	return res
		.status(200)
		.json(
			new ApiResponse(200, latestRecipes, "Latest Recipes fetched successfully")
		);
});

const getCreatedRecipesOfUser = asyncHandler(async (req, res) => {
	const userId = req.params.userId;
	const foundUser = await User.findById(userId);
	if (!foundUser) {
		throw new ApiError(404, "User not found");
	}
	const loggedInUser = req.user?._id;
	let recipes = [];
	if (loggedInUser && loggedInUser.toString === userId.toString()) {
		recipes = await Recipe.find({ author: userId }).select(
			"title author cookingTime recipePhoto avgRating totalReviews"
		);
	} else {
		recipes = await Recipe.find({ author: userId, isPublished: true }).select(
			"title author cookingTime recipePhoto avgRating totalReviews"
		);
	}
	return res
		.status(200)
		.json(
			new ApiResponse(200, recipes, "created recipes fetched successfully")
		);
});

export {
	createRecipe,
	viewRecipe,
	updateRecipeTextDetails,
	updateRecipePhoto,
	deleteRecipePhoto,
	deleteRecipe,
	getAllRecipes,
	getFourRandomRecipes,
	getCreatedRecipesOfUser,
};
