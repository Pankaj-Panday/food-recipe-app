import { axiosInstance, ErrorResponse } from "../utils/index.js";

class UserService {
	async register({ name, email, password, avatar }) {
		try {
			return await axiosInstance.post(
				"/users/register",
				{ name, email, password, avatar },
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			// login user if successfully registered
			// return this.loginUser({ email, password });
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async login({ email, password }) {
		try {
			const userData = { email, password };
			return await axiosInstance.post("/users/login", userData);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async current() {
		try {
			return await axiosInstance.get("/users/current");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async logout() {
		try {
			return await axiosInstance.post("/users/logout");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async refreshAccessToken() {
		try {
			return await axiosInstance.post("/users/refresh-token");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async updatePassword({ curPassword, newPassword }) {
		try {
			return await axiosInstance.patch("/users/update-password", {
				curPassword,
				newPassword,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async updateDetails({ name }) {
		try {
			return await axiosInstance.patch("/users/update-details", { name });
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async updateAvatar(avatar) {
		try {
			return await axiosInstance.patch(
				"/users/update-avatar",
				{ avatar },
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

	async removeAvatar() {
		try {
			return await axiosInstance.patch("/users/remove-avatar");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async getDetailsOfUser(userId) {
		try {
			return await axiosInstance.get(`/users/${userId}`);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async delete() {
		try {
			return await axiosInstance.delete("/users/delete");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async savedRecipes() {
		try {
			return await axiosInstance.get("/recipes/saved-recipes");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}

	async createdRecipesOfUser(userId) {
		try {
			return await axiosInstance.get(`recipes/created-recipes/${userId}`);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	}
}

const userService = new UserService();

export default userService;
