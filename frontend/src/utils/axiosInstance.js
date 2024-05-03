import config from "../config/config.js";
import axios from "axios";
import { ErrorResponse } from "./index.js";

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
		// it recieves actual api error
		let customError = new ErrorResponse(error);
		// no response but request was sent
		if (!error.response && error.request && !customError.isReqAborted) {
			console.error("Request: ", error.request);
		}

		console.error("AxiosError :: Message :: ", customError.message);

		return Promise.reject(customError);
	}
);

export default axiosInstance;
