import { axiosInstance } from "../utils/index.js";

class RecipeService {
	async createRecipe(
		{
			title,
			introduction,
			recipePhoto,
			cookingTime,
			ingredients,
			steps,
			isPublished,
		},
		abortSignal
	) {
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
				signal: abortSignal,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async viewRecipe(recipeId, abortSignal) {
		try {
			return await axiosInstance.get(`/recipes/${recipeId}/view-recipe`, {
				signal: abortSignal,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async updateTextDetailsOfRecipe(
		recipeId,
		{ title, introduction, cookingTime, ingredients, steps, isPublished },
		abortSignal
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
				updatedData,
				{
					signal: abortSignal,
				}
			);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async updatePhotoOfRecipe(recipeId, newPhoto, abortSignal) {
		try {
			return await axiosInstance.patch(
				`/recipes/${recipeId}/update-recipe-photo`,
				{ recipePhoto: newPhoto },
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
					signal: abortSignal,
				}
			);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async deletePhotoOfRecipe(recipeId, abortSignal) {
		try {
			return await axiosInstance.patch(
				`/recipes/${recipeId}/delete-recipe-photo`,
				{},
				{ signal: abortSignal }
			);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async deleteRecipe(recipeId, abortSignal) {
		try {
			return await axiosInstance.delete(`/recipes/${recipeId}/delete-recipe`, {
				signal: abortSignal,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async saveRecipe(recipeId, abortSignal) {
		try {
			return await axiosInstance.post(
				`/recipes/${recipeId}/save-recipe`,
				{},
				{ signal: abortSignal }
			);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async unsaveRecipe(recipeId, abortSignal) {
		try {
			return await axiosInstance.delete(`/recipes/${recipeId}/unsave-recipe`, {
				signal: abortSignal,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async viewAllRecipes(pageNum, limit, abortSignal) {
		// recives a query
		try {
			return await axiosInstance.get("/recipes/all", {
				params: {
					page: pageNum,
					limit: limit,
				},
				signal: abortSignal,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async savedRecipesByCurrentUser(abortSignal) {
		try {
			return await axiosInstance.get("/recipes/saved-recipes", {
				signal: abortSignal,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async createdRecipesByUser(userId, abortSignal) {
		try {
			return await axiosInstance.get(`recipes/created-recipes/${userId}`, {
				signal: abortSignal,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async getRandomRecipes(abortSignal) {
		try {
			return await axiosInstance.get("/recipes/random-recipes", {
				signal: abortSignal,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}
}

const recipeService = new RecipeService();
export default recipeService;
