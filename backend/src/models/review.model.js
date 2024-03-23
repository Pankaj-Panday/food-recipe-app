import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { Recipe } from "./recipe.model.js";

const reviewSchema = new mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	recipe: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "recipe",
		required: true,
	},
	rating: {
		type: Number,
		min: [1, "rating should be in range 1 to 5"],
		max: [5, "rating should be in range 1 to 5"],
		required: true,
		default: null,
	},
	comment: {
		type: String,
		default: "",
		maxLength: [250, "comment should only be 250 characters long"],
	},
});

reviewSchema.index({ owner: 1, recipe: 1 }, { unique: true }); // won't allow duplicate entries for same owner-recipe combo

reviewSchema.post("save", async function (reviewDoc) {
	await Recipe.calculateAvgRating(reviewDoc.recipe);
});

reviewSchema.post("findOneAndDelete", async function (reviewDoc) {
	await Recipe.calculateAvgRating(reviewDoc.recipe);
});

reviewSchema.plugin(aggregatePaginate);
export const Review = mongoose.model("Review", reviewSchema);
