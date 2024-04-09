import config from "../config/config.js";
import axios from "axios";

const axiosInstance = axios.create({
	baseURL: config.backendUrl,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
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

export default axiosInstance;
