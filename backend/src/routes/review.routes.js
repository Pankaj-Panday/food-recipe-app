import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
	checkReviewExistence,
	createReview,
	deleteReview,
	getAllReviewsOfRecipe,
	updateReview,
	getReviewById,
} from "../controllers/review.controller.js";

const router = Router();

router.route("/create/:recipeId").post(verifyToken, createReview);
router.route("/:reviewId/view").get(getReviewById);
router.route("/:reviewId/update").patch(verifyToken, updateReview);
router.route("/:reviewId/delete").delete(verifyToken, deleteReview);
router.route("/view-all/:recipeId").get(getAllReviewsOfRecipe);
router.route("/exist/:recipeId").get(verifyToken, checkReviewExistence);

export default router;
