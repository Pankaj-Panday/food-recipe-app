import { Router } from "express";
import { verifyToken, optionalAuth } from "../middlewares/auth.middleware.js";
import {
	createRecipe,
	viewRecipe,
	updateRecipeTextDetails,
	updateRecipePhoto,
	deleteRecipePhoto,
	deleteRecipe,
	getAllRecipes,
	getFourRandomRecipes,
	getCreatedRecipesOfUser,
	searchRecipeSummaryByName,
	viewFullRecipeByName,
} from "../controllers/recipe.controller.js";
import {
	saveRecipe,
	unsaveRecipe,
	getSavedRecipesOfUser,
	checkRecipeIsSaved,
} from "../controllers/savedRecipe.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/:recipeId/view-recipe").get(optionalAuth, viewRecipe);

// secured routes
router
	.route("/create-recipe")
	.post(verifyToken, upload.single("recipePhoto"), createRecipe);

router
	.route("/:recipeId/update-recipe")
	.patch(verifyToken, updateRecipeTextDetails);

router
	.route("/:recipeId/update-recipe-photo")
	.patch(verifyToken, upload.single("recipePhoto"), updateRecipePhoto);

router
	.route("/:recipeId/delete-recipe-photo")
	.patch(verifyToken, deleteRecipePhoto);

router.route("/:recipeId/delete-recipe").delete(verifyToken, deleteRecipe);

router.route("/:recipeId/save-recipe").post(verifyToken, saveRecipe);
router.route("/:recipeId/unsave-recipe").delete(verifyToken, unsaveRecipe);
router.route("/all").get(getAllRecipes);
router.route("/random-recipes").get(getFourRandomRecipes);
router.route("/saved-recipes").get(verifyToken, getSavedRecipesOfUser);
router
	.route("/created-recipes/:userId")
	.get(optionalAuth, getCreatedRecipesOfUser);

router.route("/:recipeId/check-saved").get(verifyToken, checkRecipeIsSaved);
router.route("/search").get(searchRecipeSummaryByName);
router.route("/view-recipe-by-name/:recipeName").get(viewFullRecipeByName);

export default router;
