import "dotenv/config";
import { app } from "./app.js";
import connectDB from "../db/connect.js";

connectDB()
	.then(() => {
		app.on("error", (error) => {
			console.log("ERR: ", error); // database is connected but there is some other error
			throw error;
		});
		const port = process.env.PORT || 3001;

		app.listen(port, () => {
			console.log(`Server started at http://localhost:${port}`);
		});
	})
	.catch((error) => {
		console.log("Mongo db connection failed!! ", error);
	});

export default app;

// Another approach to connect to database
/*
(async function () {
	try {
		await mongoose.connect(`${process.env.MONGODB_URI}`, { dbName: DB_NAME });
		app.on("error", (error) => {
			console.log("ERR: ", error); // the db is connected but for some reason app isn't able to talk to db
			throw error;
		});
		app.listen(process.env.PORT, () => {
			console.log(
				`Server is listening on http://localhost:${process.env.PORT}`
			);
		});
	} catch (error) {
		console.error("ERROR: ", error); // error in connecting to db
		throw error;
	}
})();

*/
