import { axiosInstance } from "../utils/index.js";

class UserService {
	async registerUser({ name, email, password, avatar }, abortSignal) {
		try {
			await axiosInstance.post(
				"/users/register",
				{ name, email, password, avatar },
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
					signal: abortSignal,
				}
			);
			// login user if successfully registered
			return await this.loginUser({ email, password });
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async loginUser({ email, password }, abortSignal) {
		try {
			const userData = { email, password };
			return await axiosInstance.post("/users/login", userData, {
				signal: abortSignal,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async currentUser(abortSignal) {
		try {
			return await axiosInstance.get("/users/current", { signal: abortSignal });
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async logoutUser(abortSignal) {
		try {
			return await axiosInstance.post(
				"/users/logout",
				{},
				{ signal: abortSignal }
			);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async refreshAccessTokenOfUser(abortSignal) {
		try {
			return await axiosInstance.post(
				"/users/refresh-token",
				{},
				{ signal: abortSignal }
			);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async updateUserPassword({ curPassword, newPassword }, abortSignal) {
		try {
			return await axiosInstance.patch(
				"/users/update-password",
				{
					curPassword,
					newPassword,
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

	async updateUserDetails({ name }, abortSignal) {
		try {
			return await axiosInstance.patch(
				"/users/update-details",
				{ name },
				{ signal: abortSignal }
			);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async updateUserAvatar(avatar, abortSignal) {
		try {
			return await axiosInstance.patch(
				"/users/update-avatar",
				{ avatar },
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

	async removeUserAvatar(abortSignal) {
		try {
			return await axiosInstance.patch(
				"/users/remove-avatar",
				{},
				{ signal: abortSignal }
			);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async getUserDetailsById(userId, abortSignal) {
		try {
			return await axiosInstance.get(`/users/${userId}`, {
				signal: abortSignal,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}

	async deleteUser(abortSignal) {
		try {
			return await axiosInstance.delete("/users/delete", {
				signal: abortSignal,
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			throw error;
		}
	}
}

const userService = new UserService();

export default userService;
