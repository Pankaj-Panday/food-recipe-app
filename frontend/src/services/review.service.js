import { axiosInstance } from "../utils/index.js";

class ReviewService {
	async create(recipeId, { rating, comment }) {
		try {
			return await axiosInstance.post(`/reviews/create/${recipeId}`, {
				rating,
				comment,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async view(reviewId) {
		try {
			return await axiosInstance.get(`/reviews/${reviewId}/view`);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async update(reviewId, { rating, comment }) {
		try {
			return await axiosInstance.patch(`/reviews/${reviewId}/update`, {
				rating,
				comment,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async delete(reviewId) {
		try {
			return await axiosInstance.delete(`/reviews/${reviewId}/delete`);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async allReviewsOnRecipe(recipeId, pageNum) {
		try {
			return await axiosInstance.get(`/reviews/view-all/${recipeId}`, {
				params: {
					page: pageNum || 1,
				},
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async reviewExistOnRecipeByCurrentUser(recipeId) {
		try {
			return await axiosInstance.get(`/reviews/exist/${recipeId}`);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}
}

const reviewService = new ReviewService();
export default reviewService;
