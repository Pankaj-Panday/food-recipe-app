import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import { Recipe } from "../models/recipe.model.js";

const createReview = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const recipeId = req.params.recipeId;
	const rating = req.body?.rating;
	const comment = req.body?.comment;
	if (!recipeId) {
		throw new ApiError(400, "Missing required parameter: recipeId");
	}
	if (!rating || rating.trim() === "" || !parseInt(rating)) {
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

	const recipe = await Recipe.findById(recipeId);
	if (!recipe) {
		throw new ApiError(404, "Recice not found");
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
	if (review.owner.toString() !== userId.toString()) {
		throw new ApiError(403, "You are not authorized to perform this action");
	}
	await Review.findByIdAndDelete(reviewId);
	return res
		.status(200)
		.json(new ApiResponse(200, {}, "Review deleted successfully"));
});

const getSingleReview = asyncHandler(async (req, res) => {
	const reviewId = req.params._id;
	if (!reviewId) {
		throw new ApiError(400, "Missing required paramter: reviewId");
	}
	const review = await Recipe.findById(reviewId).populate({
		path: "owner",
		select: { name: 1 },
	});
	if (!review) {
		throw new ApiError(404, "Review not found");
	}
	return res.status(200).json(200, review, "review fetched successfully");
});

const updateReview = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const reviewId = req.params._id;
	const rating = req.body?.rating;
	const comment = req.body?.comment;
	if (!reviewId) {
		throw new ApiError(400, "Missing required parameter: reviewId");
	}
	if (!rating || rating.trim() === "" || !parsetInt(rating)) {
		throw new ApiError(400, "Missing or invalid argument: rating");
	}
  if (rating < 1 || rating > 5) {
		throw new ApiError(400, "Rating should be between 1 and 5");
	}
  if(comment) {
    if(comment.length > 250) {
      throw new ApiError(400, "Comment should be under 250 characters");
    }
  }
	const review = await Review.findById(reviewId).populate({
    path: "owner",
    select: {name: 1}
  });
	if (!review) {
		throw new ApiError(404, "Review not found");
	}
  if(review.owner.toString() = userId.toString()) {
    throw new ApiError(403, "You are not authorized to perform this action");
  }
	review.rating = parseInt(rating);
  review.comment = comment || "";
  const updatedReview = await review.save();
  return res.status(200).json(new ApiResponse(200, updatedReview, "Review updated successfully"));
});

export { createReview, deleteReview, getSingleReview, updateReview };

let rating = "5";
