import { axiosInstance } from "../utils/index.js";

class ReviewService {
	async createReview(recipeId, { rating, comment }, abortSignal) {
		try {
			return await axiosInstance.post(
				`/reviews/create/${recipeId}`,
				{
					rating,
					comment,
				},
				{ signal: abortSignal }
			);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async viewReviewById(reviewId, abortSignal) {
		try {
			return await axiosInstance.get(`/reviews/${reviewId}/view`, {
				signal: abortSignal,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async updateReview(reviewId, { rating, comment }, abortSignal) {
		try {
			return await axiosInstance.patch(
				`/reviews/${reviewId}/update`,
				{
					rating,
					comment,
				},
				{
					signal: abortSignal,
				}
			);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async deleteReview(reviewId, abortSignal) {
		try {
			return await axiosInstance.delete(`/reviews/${reviewId}/delete`, {
				signal: abortSignal,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async allReviewsOnRecipe(recipeId, pageNum, abortSignal) {
		try {
			return await axiosInstance.get(`/reviews/view-all/${recipeId}`, {
				params: {
					page: pageNum || 1,
				},
				signal: abortSignal,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async viewUserReviewOnRecipe(userId, recipeId, abortSignal) {
		try {
			return await axiosInstance.get(`/reviews/view/${userId}/${recipeId}`, {
				signal: abortSignal,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}
}

const reviewService = new ReviewService();
export default reviewService;
