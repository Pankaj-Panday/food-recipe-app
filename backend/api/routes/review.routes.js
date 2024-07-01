import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
	getUserReviewOnRecipe,
	createReview,
	deleteReview,
	getAllReviewsOfRecipe,
	updateReview,
	getReviewById,
} from "../controllers/review.controller.js";

const router = Router();

router.route("/create/:recipeId").post(verifyToken, createReview);
router.route("/:reviewId/update").patch(verifyToken, updateReview);
router.route("/:reviewId/delete").delete(verifyToken, deleteReview);
router.route("/view-all/:recipeId").get(getAllReviewsOfRecipe);
router.route("/view/:reviewId").get(getReviewById);
router.route("/view/:userId/:recipeId").get(verifyToken, getUserReviewOnRecipe);

export default router;
