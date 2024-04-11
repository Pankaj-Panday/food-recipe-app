import { axiosInstance } from "../utils/index.js";

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
			throw error;
		}
	}

	async view(recipeId) {
		try {
			return await axiosInstance.get(`/recipes/${recipeId}/view-recipe`);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
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
			throw error;
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
			throw error;
		}
	}

	async deletePhoto(recipeId) {
		try {
			return await axiosInstance.patch(
				`/recipes/${recipeId}/delete-recipe-photo`
			);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async delete(recipeId) {
		try {
			return await axiosInstance.delete(`/recipes/${recipeId}/delete-recipe`);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async save(recipeId) {
		try {
			return await axiosInstance.post(`/recipes/${recipeId}/save-recipe`);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async unsave(recipeId) {
		try {
			return await axiosInstance.delete(`/recipes/${recipeId}/unsave-recipe`);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
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
			throw error;
		}
	}

	async savedRecipesByCurrentUser() {
		try {
			return await axiosInstance.get("/recipes/saved-recipes");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async createdRecipesByUser(userId) {
		try {
			return await axiosInstance.get(`recipes/created-recipes/${userId}`);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async randomRecipes() {
		try {
			return await axiosInstance.get("/recipes/random-recipes");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}
}

const recipeService = new RecipeService();
export default recipeService;
