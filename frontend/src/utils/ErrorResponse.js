class ApiErrorResponse extends Error {
	constructor(error) {
		super(error.message || "Something went wrong", { cause: error });
		this.isAxiosError = error.name ? error.name === "AxiosError" : false;
		this.name = this.constructor.name;
		this.success = false;
		this.statusCode = error.response?.status || 500;
		this.reason = error.response?.data.message || "Unknown";
		this.data = null;

		// if no response recieved but request sent
		if (!error.response && error.request) {
			this.reason = "No response received from server";
		} else if (!(error.response && error.request)) {
			// no response and no request to server
			this.reason = "Problem sending request to server";
		}
	}
}

export default ApiErrorResponse;
