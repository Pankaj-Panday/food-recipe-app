import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./db/connect.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDB();

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
