import mongoose from "mongoose";
import { Recipe } from "../models/recipe.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/remoteFileManage.js";
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

// create a recipe
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

// get recipe (view recipe by id)
const viewRecipe = asyncHandler(async (req, res) => {
	// get recipe id from url
	// check in database if this recipe exist or not
	// if found, populate the user field with some details from user (aggregation pipeline)
	// return recipe
	const recipeId = req.params.recipeId;
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
	];
	const recipe = await Recipe.aggregate(pipeline);
	console.log(recipe);
	if (!recipe?.length) {
		// empty array
		throw new ApiError(404, "Recipe doesn't exist");
	}
	return res
		.status(200)
		.json(new ApiResponse(200, recipe[0], "recipe fetched succesfully"));
});

// update a recipe (by id)
const updateRecipe = asyncHandler(async (req, res) => {
	// make a hidden input in frontend and send the status & public_id or url of old photo through it
	// get that input in backend from req.body as "photoStatus" and decide what to do with photo update
	// input will send values like "changed", "unchanged", "deleted"
});

const updateRecipePhoto = asyncHandler(async (req, res) => {});

const deleteRecipePhoto = asyncHandler(async (req, res) => {
	// get all the data from frontend - (recipe id, and userid)
	// find the recipe in the database
	// check if the user is the current owner of the recipe whose photo he is deleting (by matching userid with author)
	// create an object from
	// delete the photo
	const userId = req.user._id;
	const recipeId = req.params.recipeId;
	const recipe = await Recipe.findById(recipeId);
	if (!recipe) {
		throw new ApiError(404, "Can't delete photo. Recipe doesn't exist");
	}
	if (recipe.author.toString() !== userId.toString()) {
		throw new ApiError(403, "You are not authorized to perform this action");
	}
	let deletedPhoto = {
		url: recipe.recipePhoto.url,
		publicId: recipe.recipePhoto.publicId,
	};
	recipe.recipePhoto = { url: null, publicId: null };
	await recipe.save({ validateBeforeSave: false });
});
// delete a recipe
// save a recipe mapped to a particular user
// get all recipes (not sure but may have to implement pagination)

// rate a recipe
// update rating for a recipe
// delete rating (maybe a separate route)

// add comment on a recipe
// update comment on a recipe
// delete comment on recipe

export {
	createRecipe,
	viewRecipe,
	updateRecipe,
	updateRecipePhoto,
	deleteRecipePhoto,
};
