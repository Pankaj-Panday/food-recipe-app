import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
	createRecipe,
	viewRecipe,
	updateRecipeTextDetails,
	updateRecipePhoto,
	deleteRecipePhoto,
	deleteRecipe,
	saveRecipe,
	unsaveRecipe,
} from "../controllers/recipe.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/:recipeId/view-recipe").get(viewRecipe);

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

export default router;
