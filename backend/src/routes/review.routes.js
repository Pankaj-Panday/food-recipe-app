import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
	createReview,
	deleteReview,
	getAllReviewsOfRecipe,
	getSingleReview,
	updateReview,
} from "../controllers/review.controller.js";

const router = Router();

router.route("/create/:recipeId").post(verifyToken, createReview);
router.route("/:reviewId/view").get(getSingleReview);
router.route("/:reviewId/update").patch(verifyToken, updateReview);
router.route("/:reviewId/delete").delete(verifyToken, deleteReview);
router.route("/view-all/:recipeId").get(getAllReviewsOfRecipe);

export default router;
