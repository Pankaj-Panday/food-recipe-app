import { axiosInstance } from "../utils/index.js";

class UserService {
	async registerUser({ name, email, password, avatar }) {
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
			throw error;
		}
	}

	async loginUser({ email, password }) {
		try {
			const userData = { email, password };
			return await axiosInstance.post("/users/login", userData);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async currentUser() {
		try {
			return await axiosInstance.get("/users/current");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async logoutUser() {
		try {
			return await axiosInstance.post("/users/logout");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async refreshAccessTokenOfUser() {
		try {
			return await axiosInstance.post("/users/refresh-token");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async updateUserPassword({ curPassword, newPassword }) {
		try {
			return await axiosInstance.patch("/users/update-password", {
				curPassword,
				newPassword,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async updateUserDetails({ name }) {
		try {
			return await axiosInstance.patch("/users/update-details", { name });
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async updateUserAvatar(avatar) {
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
			throw error;
		}
	}

	async removeUserAvatar() {
		try {
			return await axiosInstance.patch("/users/remove-avatar");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async getUserDetailsById(userId) {
		try {
			return await axiosInstance.get(`/users/${userId}`);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async deleteUser() {
		try {
			return await axiosInstance.delete("/users/delete");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}
}

const userService = new UserService();

export default userService;
