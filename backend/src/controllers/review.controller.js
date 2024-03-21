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
  if(comment) {
    if(comment.length > 250) {
      throw new ApiError(400, "Comment should be under 250 characters");
    }
  }
  return { rating: parseInt(rating), comment: comment || "" };
}

const createReview = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const recipeId = req.params.recipeId;
	const {rating, comment} = validateReviewData(req.body?.rating, req.body?.comment);

  const recipe = await Recipe.findOne(recipeId);
	if (!recipe) {
		throw new ApiError(404, "Recice not found");
	}

  if(!recipe.isPublished) {
    throw new ApiError(403, "You cannot create review on a private recipe.")
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
  const recipe = await Recipe.findById(review?.recipe);
  if(!recipe.isPublished) {
    throw new ApiError(403, "You cannot access review of a private recipe");
  }
	return res.status(200).json(200, review, "review fetched successfully");
});

const updateReview = asyncHandler(async (req, res) => {
	const userId = req.user._id;
	const reviewId = req.params._id;
	const {rating, comment} = validateReviewData(req.body?.rating, req.body?.comment);
	const review = await Review.findById(reviewId);
	if (!review) {
		throw new ApiError(404, "Review not found");
	}

  const recipe = await Recipe.findById(review?.recipe);
  if(!recipe.isPublished) {
    throw new ApiError(403, "You cannot update review of a private recipe");
  }

  if(review.owner.toString() = userId.toString()) {
    throw new ApiError(403, "You are not authorized to perform this action");
  }
	review.rating = parseInt(rating);
  review.comment = comment || "";
  const updatedReview = await review.save();
  return res.status(200).json(new ApiResponse(200, updatedReview, "Review updated successfully"));
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
  if(!recipe.isPublished) {
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

const getAllReviewsOfRecipe = asyncHandler(async(req, res) => {
  const recipeId = req.params.recipeId;
  if(!recipeId) {
    throw new ApiError(400, "Missing required parameter: recipeId");
  }
  
  const recipe = await Recipe.findById(recipeId);
  if(!recipe.isPublished) {
    throw new ApiError(403, "You cannot access reviews of a private recipe");
  }

  const recipeObjectId = new mongoose.Types.ObjectId(recipeId);
  const pipeline = [ 
    {
      $match: {recipe: recipeObjectId}
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {name: 1}
          },
        ]
      }
    },
    {
      $unwind: "$owner"
    },
    {
      $project: {owner: 1, comment: 1}
    }
  ];
  const reviewAggregate = Review.aggregate(pipeline);
  const options = {
    offset: 0,
    limit: 5,
  }
  const result = await Review.aggregatePaginate(reviewAggregate, options);
  const {totalDocs, docs, limit, offset, hasPrevPage, hasNextPage, prevPage, nextPage} = result;

  const response = {
    reviews: docs,
    totalReviewsCount: totalDocs,
    reviewsShown: limit,
    offset,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage
  }
  
  return res.status(200).json(new ApiResponse(200, response, "reviews fetched successfully"));
});

export { createReview, deleteReview, getSingleReview, updateReview, getAllReviewsOfRecipe };
