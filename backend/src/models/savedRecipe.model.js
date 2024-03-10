import mongoose from "mongoose";

const userSavedRecipeSchema = new mongoose.Schema({
	recipe: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Recipe",
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

export const UserSavedRecipe = mongoose.model(
	"UserSavedRecipe",
	userSavedRecipeSchema
);
