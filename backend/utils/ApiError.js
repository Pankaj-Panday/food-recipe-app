// Define a custom error class named ApiError that extends the built-in Error class
class ApiError extends Error {
	// Constructor method for creating new instances of ApiError
	constructor(
		statusCode, // HTTP status code associated with the error
		message = "Something went wrong", // Default error message if not provided
		errors = [], // Array of additional error details or messages
		stack = "" // Optional stack trace associated with the error
	) {
		// Call the constructor of the parent class (Error) with the provided message
		super(message);
		// Set custom properties specific to ApiError instances
		this.statusCode = statusCode; // HTTP status code associated with the error
		this.data = null; // Placeholder for additional data related to the error (to be populated as needed)
		this.success = false; // Indicate that the API operation associated with this error was not successful
		this.errors = errors; // Array of additional error details or messages

		// If a stack trace is provided, assign it directly to the stack property
		if (stack) {
			this.stack = stack;
		} else {
			// If no stack trace is provided, capture the stack trace using Error.captureStackTrace()
			// This is useful for generating stack traces for custom error objects
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

// Export the ApiError class to make it available for use in other modules
export default ApiError;
