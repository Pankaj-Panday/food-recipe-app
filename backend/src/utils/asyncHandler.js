function asyncHandler(func) {
	return async function (req, res, next) {
		try {
			await func(req, res, next);
		} catch (error) {
			res.status(error.code || 500).json({
				success: false,
				message: error.message,
			});
		}
	};
}

export default asyncHandler;

/*
const asyncHandler = (func) => async (req, res, next) => {
	try {
		await func(req, res, next);
	} catch (err) {
		console.log("I ran");
		return res.status(err.code || 500).json({
			success: false,
			message: err.message,
		});
	}
};

// confusing syntax and seems improper error handling
const asyncHandler = (requestHandler) => {
	return (req, res, next) => {
		Promise.resolve(requestHandler(req, res, next)).catch((error) =>
			next(error)
		);
	};
};

*/
