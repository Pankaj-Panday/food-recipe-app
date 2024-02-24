const asyncHandler = (func) => async (req, res, next) => {
	try {
		func(req, res, next);
	} catch (err) {
		res.status(err.code || 500).json({
			success: false,
			message: err.message,
		});
	}
};

export default asyncHandler;

/*function asyncHandler(func) {
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
// confusing syntax and seems improper error handling
const asyncHandler = (requestHandler) => {
	return (req, res, next) => {
		Promise.resolve(requestHandler(req, res, next)).catch((error) =>
			next(error)
		);
	};
};

*/
