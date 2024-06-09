import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { UserSavedRecipe } from "../models/savedRecipe.model.js";
import { Recipe } from "../models/recipe.model.js";
import ApiError from "../utils/ApiError.js";

const saveRecipe = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const recipeId = req.params?.recipeId;
	if (!recipeId) {
		throw new ApiError(400, "Missing required URL parameter: recipeId");
	}
	const recipe = await Recipe.findById(recipeId);
	if (!recipe) {
		throw new ApiError(404, "Recipe not found");
	}
	const existingRecipe = await UserSavedRecipe.findOne({
		recipe: recipeId,
		user: userId,
	});
	if (existingRecipe) {
		throw new ApiError(409, "Recipe is already saved");
	}
	const savedRecipe = await UserSavedRecipe.create({
		recipe: recipeId,
		user: userId,
	});
	return res
		.status(200)
		.json(new ApiResponse(200, savedRecipe, "recipe saved successfully"));
});

const unsaveRecipe = asyncHandler(async (req, res) => {
	const recipeId = req.params?.recipeId;
	const userId = req.user._id;
	if (!recipeId) {
		throw new ApiError(400, "Missing required parameter: recipeId");
	}
	const unsavedRecipe = await UserSavedRecipe.findOneAndDelete({
		recipe: recipeId,
		user: userId,
	});
	if (!unsavedRecipe) {
		throw new ApiError(404, "Recipe not saved by user");
	}
	return res
		.status(200)
		.json(new ApiResponse(200, {}, "Recipe unsaved successfully"));
});

const getSavedRecipesOfUser = asyncHandler(async (req, res) => {
	const userId = req.user?._id;

	// below had to convert to string becasue it was throwing warning
	const userObjectId = new mongoose.Types.ObjectId("" + userId);

	// only show recipes which are published by owner
	// only show title, recipePhoto, cookingtime, rating, author's name of recipe
	const pipeline = [
		{
			$match: { user: userObjectId },
		},
		{
			$project: { recipe: 1, _id: 0 }, // [{recipe: recipeId1}, {recipe: recipeId2}]
		},
		{
			$lookup: {
				from: "recipes",
				localField: "recipe",
				foreignField: "_id",
				as: "recipe",
				pipeline: [
					{
						$lookup: {
							from: "users",
							localField: "author",
							foreignField: "_id",
							pipeline: [
								{
									$project: { name: 1 }, // _id is included by default in project stage
								},
							],
							as: "author",
						},
					},
					{
						$set: { author: { $arrayElemAt: ["$author", 0] } },
					},
				],
			},
		},
		{
			$unwind: "$recipe",
		},
		{
			$match: { $expr: { $eq: ["$recipe.isPublished", true] } },
		},
		{
			$project: {
				_id: "$recipe._id",
				title: "$recipe.title",
				cookingTime: "$recipe.cookingTime",
				recipePhoto: "$recipe.recipePhoto",
				author: "$recipe.author",
				avgRating: "$recipe.avgRating",
				totalReviews: "$recipe.totalReviews",
			},
		},
	];

	const recipes = await UserSavedRecipe.aggregate(pipeline);

	return res
		.status(200)
		.json(new ApiResponse(200, recipes, "saved recipes fetched successfully"));
});

const checkRecipeIsSaved = asyncHandler(async (req, res) => {
	try {
		const { recipeId } = req.params;
		const userId = req?.user._id;

		if (!recipeId || !userId) {
			throw new ApiError(400, "Missing required parameter: recipeId or userId");
		}

		if (
			!mongoose.isObjectIdOrHexString(recipeId) ||
			!mongoose.isObjectIdOrHexString(userId)
		) {
			throw new ApiError(400, "Invalid recipeId or userId");
		}

		const savedRecipe = await UserSavedRecipe.findOne({
			recipe: recipeId,
			user: userId,
		});

		if (savedRecipe) {
			return res
				.status(200)
				.json(new ApiResponse(500, { isSaved: true }, "check successful"));
		} else {
			return res
				.status(200)
				.json(new ApiResponse(500, { isSaved: false }, "check successful"));
		}
	} catch (error) {
		throw new ApiError(
			500,
			"Some problem while checking if recipe is saved or not"
		);
	}
});

export { saveRecipe, unsaveRecipe, getSavedRecipesOfUser, checkRecipeIsSaved };
