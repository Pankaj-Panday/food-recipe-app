import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { UserSavedRecipe } from "../models/savedRecipe.model.js";

const reviewSchema = new mongoose.Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		content: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

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
		rating: {
			type: Number,
			default: null,
		},
		reviews: {
			type: [reviewSchema],
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		isPublished: {
			type: Boolean, // to allow user to save draft of a recipe
			default: false,
		},
	},
	{ timestamps: true }
);

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
