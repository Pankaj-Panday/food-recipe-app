import config from "../config/config.js";
import axios from "axios";
import ErrorResponse from "../utils/ErrorResponse.js";

const axiosInstance = axios.create({
	baseURL: config.backendUrl,
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	function (response) {
		return response.data;
	},
	function (error) {
		let customError = {
			isAxiosError: error.name ? error.name === "AxiosError" : false,
			message: error.message || "Something went wrong",
			config: error.config,
			status: error.response?.status || 500,
			reason: error.response?.data.message || "Unknown",
		};

		if (error.response) {
			// The request was made and the server responded with a non-2xx status code
			console.error("AxiosError :: Message :: ", customError.message);
		} else if (error.request) {
			// The request was made but no response was received
			customError.reason = "No response received from server";
			console.error("Request: ", error.request);
			console.error("AxiosError :: Message :: ", customError.message);
		} else {
			// Something happened in setting up the request that triggered an Error
			customError.reason = "Error during request setup";
			console.error("AxiosError :: Message :: ", customError.message);
		}

		return Promise.reject(customError);
	}
);

class UserService {
	registerUser = async ({ name, email, password, avatar }) => {
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
	};

	loginUser = async ({ email, password }) => {
		try {
			const userData = { email, password };
			return await axiosInstance.post("/users/login", userData, {
				headers: {
					"Content-Type": "application/json",
				},
			});
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	};

	currentUser = async () => {
		try {
			return await axiosInstance.get("/users/current");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	};

	logoutUser = async () => {
		try {
			return await axiosInstance.post("/users/logout");
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	};

	// refresh access token for user
	refreshAccessToken = async () => {
		try {
			return await axiosInstance.post(
				"/users/refresh-token",
				{},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
		} catch (error) {
			console.error("Reason :: ", error.reason);
			return new ErrorResponse(error.status, error.reason);
		}
	};
	// change user password
	// update text details of user
	// update avatar
	// remove avatar
	// get user details
	// delete user account
}

const userService = new UserService();

export default userService;
