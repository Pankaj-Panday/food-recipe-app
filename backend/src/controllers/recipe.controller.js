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
	isInvalid = arr.some((value) => {
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
		throw new ApiError(400, "recipe title and cooking time can not be empty");
	}
	if (!isValidArray(ingredients) && !isValidArray(steps)) {
		throw new ApiError(400, "ingredients and steps aren't valid inputs");
	}
	let recipePhoto;
	if (recipePhotoLocalPath) {
		recipePhoto = await uploadToCloudinary(recipePhotoLocalPath);
		if (!recipePhoto) {
			// uploading failed
			await removeLocalFile(recipePhotoLocalPath);
			throw new ApiError(500, "Error uploading photo. Please try again!!");
		}
		await removeLocalFile(recipePhotoLocalPath);
	}
	// create the recipe and save to database
	const recipe = await Recipe.create({
		title,
		introduction: introduction || "",
		cookingTime: parseInt(cookingTime),
		recipePhoto: {
			url: recipePhoto?.url || null,
			publicId: recipePhoto?.publicId || null,
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
	try {
		const pipeline = [
			{
				$match: { _id: mongoose.Types.ObjectId(recipeId) },
			},
			{
				$lookup: {
					from: "users",
					localField: "author",
					foreignField: "_id",
					as: "author",
				},
			},
			{
				$unwind: "$author",
			},
			{
				$set: {
					author: {
						_id: "$author._id",
						name: "$author.name",
					},
				},
			},
		];
		const recipe = await Recipe.aggregate(pipeline)[0];
		if (!recipe?.length) {
			// empty array
			throw new ApiError(404, "Recipe doesn't exist");
		}
		return res.status(
			200,
			new ApiResponse(200, recipe, "recipe fetched succesfully")
		);
	} catch (error) {
		// not required but its here to give a good message to user
		throw new ApiError(500, "Error fetching recipe");
	}
});
// get all recipes (not sure but may have to implement pagination)
// update a recipe (by id)
// delete a recipe
// save a recipe mapped to a particular user

// rate a recipe
// update rating for a recipe
// delete rating (maybe a separate route)

// add comment on a recipe
// update comment on a recipe
// delete comment on recipe

export { createRecipe, viewRecipe };
