class ErrorResponse {
	constructor(status, message) {
		this.statusCode = status || 500;
		this.message = message || "Something went wrong";
		this.data = null;
		this.success = false;
	}
}

export default ErrorResponse;
