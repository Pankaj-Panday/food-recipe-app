import mongoose from "mongoose";

const userSavedRecipeSchema = new mongoose.Schema({
	recipe: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Recipe",
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

export const UserSavedRecipe = mongoose.model(
	"UserSavedRecipe",
	userSavedRecipeSchema
);
