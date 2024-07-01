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

userSavedRecipeSchema.index({ recipe: 1, user: 1 });

export const UserSavedRecipe = mongoose.model(
	"UserSavedRecipe",
	userSavedRecipeSchema
);
