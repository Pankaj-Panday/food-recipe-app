import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createRecipe, viewRecipe } from "../controllers/recipe.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/:recipeId/view-recipe").get(viewRecipe);

// secured routes
router
	.route("/create-recipe")
	.post(verifyToken, upload.single("recipePhoto"), createRecipe);

export default router;
