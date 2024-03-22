import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { UserSavedRecipe } from "../models/savedRecipe.model.js";
import ApiError from "../utils/ApiError.js";

const recipeSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Name cannot be empty"],
			trim: true,
			index: true,
		},
		introduction: {
			type: String,
			default: "",
		},
		cookingTime: {
			type: Number,
			required: [true, "cookingTime cannot be empty"],
		},
		recipePhoto: {
			url: {
				type: String, // url of the photo
				default: null,
			},
			publicId: {
				type: String,
				default: null,
			},
		},
		ingredients: {
			type: [String],
			required: [true, "Ingredients cannot be empty"],
		},
		steps: {
			// should be an array of strings
			type: [String],
			required: [true, "Steps cannot be empty"],
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		isPublished: {
			type: Boolean, // to allow user to save draft of a recipe
			default: false,
		},
		avgRating: {
			type: Number,
			min: [1, "rating should be in range 1 to 5"],
			max: [5, "rating should be in range 1 to 5"],
			default: null,
		},
		totalReviews: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

recipeSchema.statics.calculateAvgRating = async function (recipeId) {
	try {
		const recipeObjectId = new mongoose.Types.ObjectId("" + recipeId);
		const pipeline = [
			{
				$match: { _id: recipeObjectId },
			},
			{
				$lookup: {
					from: "reviews",
					localField: "_id",
					foreignField: "recipe",
					as: "reviews",
				},
			},
			{
				$unwind: "$reviews",
			},
			{
				$group: {
					_id: null,
					average: { $avg: "$reviews.rating" },
					totalReviews: { $count: {} },
				},
			},
			{
				$project: {
					average: { $round: ["$average", 1] },
					totalReviews: 1,
				},
			},
		];
		const result = await this.aggregate(pipeline); // inside a static method, this refers to the Model
		// result looks something like this (an array containing single object)
		// [ { _id: null, totalReviews: 3, average: 3.3 } ]
		if (result?.length > 0) {
			await this.findByIdAndUpdate(recipeId, {
				avgRating: result[0].average,
				totalReviews: result[0].totalReviews,
			});
		}
	} catch (error) {
		throw new ApiError(error.code, error.message);
	}
};

// below hook will be triggered when someone calls findByIdAndDelete or findOneAndDelete
recipeSchema.post("findOneAndDelete", async function (recipeDoc) {
	const recipeId = recipeDoc._id;
	await UserSavedRecipe.deleteMany({ recipe: recipeId });
});

recipeSchema.pre("deleteMany", async function () {
	// 1. get ids of all the recipes being deleted
	// 2. remove saved recipe refrences to all the above recipes ids
	// Note: the value of "this" here is actually a query object
	const queryFilter = this.getFilter();
	const recipeIds = await Recipe.find(queryFilter).select({ _id: 1 }).lean();
	recipeIds.forEach(async (recipeId) => {
		await UserSavedRecipe.deleteMany({ recipe: recipeId });
	});
});

recipeSchema.plugin(aggregatePaginate);

export const Recipe = mongoose.model("Recipe", recipeSchema);
