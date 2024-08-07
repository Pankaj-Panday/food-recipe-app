import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import { Recipe } from "../models/recipe.model.js";

function validateReviewData(rating, comment) {
	if (!rating || !parseInt(rating)) {
		throw new ApiError(400, "Missing or invalid argument: rating");
	}
	if (rating < 1 || rating > 5) {
		throw new ApiError(400, "Rating should be between 1 and 5");
	}
	if (comment) {
		if (comment.length > 250) {
			throw new ApiError(400, "Comment should be under 250 characters");
		}
	}
	return { rating: parseInt(rating), comment: comment || "" };
}

const createReview = asyncHandler(async (req, res) => {
	try {
		const userId = req.user._id;
		const recipeId = req.params.recipeId;
		const { rating, comment } = validateReviewData(
			req.body?.rating,
			req.body?.comment
		);

		const recipe = await Recipe.findById(recipeId);
		if (!recipe) {
			throw new ApiError(404, "Recice not found");
		}

		if (recipe.author.toString() === userId.toString()) {
			throw new ApiError(403, "You cannot review your own recipe");
		}

		if (!recipe.isPublished) {
			throw new ApiError(403, "You cannot create review on a private recipe.");
		}

		const review = await Review.create({
			owner: userId,
			recipe: recipeId,
			rating: rating,
			comment: comment?.trimEnd() || "",
		});

		return res
			.status(201)
			.json(new ApiResponse(201, review, "Review created successfully"));
	} catch (error) {
		if (error.code === 11000) {
			// mongodb sends this error when unique contraint is violated
			throw new ApiError(409, `${req.user.name} already reviewed this recipe`);
		}
		throw new ApiError(error.code, error.message);
	}
});

const getUserReviewOnRecipe = asyncHandler(async (req, res) => {
	try {
		const { userId, recipeId } = req.params;
		if (!recipeId || !userId) {
			throw new ApiError(400, "Missing required parameter: userId or recipeId");
		}
		if (
			!mongoose.isObjectIdOrHexString(userId) ||
			!mongoose.isObjectIdOrHexString(recipeId)
		) {
			throw new ApiError(400, "Invalid userId or recipeId");
		}
		const review = await Review.findOne({
			owner: userId,
			recipe: recipeId,
		}).populate({
			path: "owner",
			select: { avatar: "$avatar.url", name: 1 }, // don't know how but $avatar.url is working as it works in aggregation pipeline
		});
		if (!review) {
			throw new ApiError(404, "Review not found");
		}
		return res
			.status(200)
			.json(new ApiResponse(200, review, "Review found successfully"));
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw new ApiError(error.code, error.message);
		} else {
			throw error;
		}
	}
});

const getReviewById = asyncHandler(async (req, res) => {
	const reviewId = req.params.reviewId;
	if (!reviewId) {
		throw new ApiError(400, "Missing required paramter: reviewId");
	}
	const review = await Review.findById(reviewId).populate({
		path: "owner",
		select: { name: 1 },
	});
	if (!review) {
		throw new ApiError(404, "Review not found");
	}
	const recipe = await Recipe.findById(review?.recipe);
	if (!recipe.isPublished) {
		throw new ApiError(403, "You cannot access review of a private recipe");
	}
	return res
		.status(200)
		.json(new ApiResponse(200, review, "review fetched successfully"));
});

const updateReview = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const reviewId = req.params.reviewId;
	const { rating, comment } = validateReviewData(
		req.body?.rating,
		req.body?.comment
	);
	const review = await Review.findById(reviewId);
	if (!review) {
		throw new ApiError(404, "Review not found");
	}

	const recipe = await Recipe.findById(review?.recipe);
	if (!recipe.isPublished) {
		throw new ApiError(403, "You cannot update review of a private recipe");
	}

	if (review.owner.toString() !== userId.toString()) {
		throw new ApiError(403, "You are not authorized to perform this action");
	}
	review.rating = parseInt(rating);
	review.comment = comment || "";
	const updatedReview = await review.save();

	return res
		.status(200)
		.json(new ApiResponse(200, updatedReview, "Review updated successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
	const reviewId = req.params?.reviewId;
	const userId = req.user._id;
	if (!reviewId) {
		throw new ApiError(400, "Missing required parameter: reviewId");
	}
	const review = await Review.findById(reviewId);
	if (!review) {
		throw new ApiError(404, "Review not found");
	}

	const recipe = await Recipe.findById(review?.recipe);
	if (!recipe.isPublished) {
		throw new ApiError(403, "You cannot delete review of a private recipe");
	}

	if (review.owner.toString() !== userId.toString()) {
		throw new ApiError(403, "You are not authorized to perform this action");
	}
	await Review.findByIdAndDelete(reviewId);
	return res
		.status(200)
		.json(new ApiResponse(200, {}, "Review deleted successfully"));
});

const getAllReviewsOfRecipe = asyncHandler(async (req, res) => {
	const recipeId = req.params.recipeId;
	const page = parseInt(req.query?.page || 1);
	const loggedInUser = req?.user;

	if (!recipeId) {
		throw new ApiError(400, "Missing required parameter: recipeId");
	}
	const recipe = await Recipe.findById(recipeId);
	if (!recipe) throw new ApiError(404, "Recipe not round");

	if (
		!recipe.isPublished &&
		(!loggedInUser || loggedInUser._id.toString() !== recipe.author.toString())
	) {
		throw new ApiError(403, "You cannot access reviews of a private recipe");
	}

	const recipeObjectId = new mongoose.Types.ObjectId(recipeId + "");
	const pipeline = [
		{
			$match: { recipe: recipeObjectId },
		},
		{
			$lookup: {
				from: "users",
				localField: "owner",
				foreignField: "_id",
				as: "owner",
				pipeline: [
					{
						$project: { name: 1, avatar: "$avatar.url" },
					},
				],
			},
		},
		{
			$unwind: "$owner",
		},
	];
	const reviewAggregate = Review.aggregate(pipeline);
	const options = {
		page,
		limit: 5,
	};
	const result = await Review.aggregatePaginate(reviewAggregate, options);
	const {
		totalDocs,
		docs,
		totalPages,
		offset,
		hasPrevPage,
		hasNextPage,
		prevPage,
		nextPage,
		page: curPage,
	} = result;

	const response = {
		reviews: docs,
		totalReviews: totalDocs,
		reviewsShown: docs.length,
		totalPages,
		offset,
		hasPrevPage,
		hasNextPage,
		prevPage,
		nextPage,
		curPage,
	};

	return res
		.status(200)
		.json(new ApiResponse(200, response, "reviews fetched successfully"));
});

export {
	createReview,
	getUserReviewOnRecipe,
	deleteReview,
	getReviewById,
	updateReview,
	getAllReviewsOfRecipe,
};
