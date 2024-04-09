import { axiosInstance, ErrorResponse } from "../utils/index.js";

class RecipeService {
	async create({
		title,
		introduction,
		recipePhoto,
		cookingTime,
		ingredients,
		steps,
		isPublished,
	}) {
		try {
			const recipeData = {
				title,
				introduction,
				recipePhoto,
				cookingTime,
				ingredients,
				steps,
				isPublished,
			};
			return await axiosInstance.post("/recipes/create-recipe", recipeData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async view(recipeId) {
		try {
			return await axiosInstance.get(`/recipes/${recipeId}/view-recipe`);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async updateTextDetails(
		recipeId,
		{ title, introduction, cookingTime, ingredients, steps, isPublished }
	) {
		try {
			const updatedData = {
				title,
				introduction,
				cookingTime,
				ingredients,
				steps,
				isPublished,
			};
			return await axiosInstance.patch(
				`/recipes/${recipeId}/update-recipe`,
				updatedData
			);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async updatePhoto(recipeId, newPhoto) {
		try {
			return await axiosInstance.patch(
				`/recipes/${recipeId}/update-recipe-photo`,
				newPhoto,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async deletePhoto(recipeId) {
		try {
			return await axiosInstance.patch(
				`/recipes/${recipeId}/delete-recipe-photo`
			);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async delete(recipeId) {
		try {
			return await axiosInstance.delete(`/recipes/${recipeId}/delete-recipe`);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async save(recipeId) {
		try {
			return await axiosInstance.post(`/recipes/${recipeId}/save-recipe`);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async unsave(recipeId) {
		try {
			return await axiosInstance.delete(`/recipes/${recipeId}/unsave-recipe`);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async allRecipes(pageNum) {
		// recives a query
		try {
			return await axiosInstance.get("/recipes/all", {
				params: {
					page: pageNum,
				},
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async randomRecipes() {
		try {
			return await axiosInstance.get("/recipes/random-recipes");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}
}

const recipeService = new RecipeService();
export default recipeService;
