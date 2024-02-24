import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
	{
		title: {
      type: ,
    },
		introduction: {
      type: ,
    },
		cookingTime: {
      type: ,
    },
		recipePhoto: {
      type: ,
    },
		ingredients: {
      type: ,
    },
		steps: {
      type: ,
    },
		rating: {
      type: ,
    },
		reviews: {
      type: ,
    },
		author: {
      type: ,
    },
	},
	{ timestamps: true }
);

export const Recipe = mongoose.model("Recipe", recipeSchema);
