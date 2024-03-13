import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
	createRecipe,
	updateRecipe,
	viewRecipe,
	updateRecipePhoto,
	deleteRecipePhoto,
} from "../controllers/recipe.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/:recipeId/view-recipe").get(viewRecipe);

// secured routes
router
	.route("/create-recipe")
	.post(verifyToken, upload.single("recipePhoto"), createRecipe);
router.route("/:recipeId/update-recipe").put(verifyToken, updateRecipe);
router
	.route("/:recipeId/update-recipe-photo")
	.patch(verifyToken, updateRecipePhoto);
router
	.route("/:recipeId/delete-recipe-photo")
	.patch(verifyToken, deleteRecipePhoto);

export default router;
