import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

async function connectDB() {
	try {
		const connectionInstance = await mongoose.connect(`${process.env.DB_URL}`, {
			dbName: DB_NAME,
		});
		console.log(
			`MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`
		);
	} catch (error) {
		console.log("MONGODB Connection failed: ", error);
		process.exit(1);
	}
}

export default connectDB;
