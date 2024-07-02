import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	})
);
app.use(express.json({ limit: "16kb" })); // just to see its options
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //just to see its options
app.use(cookieParser());

// import routes
import userRouter from "../routes/user.routes.js";
import recipeRouter from "../routes/recipe.routes.js";
import reviewRouter from "../routes/review.routes.js";

app.get("/", (req, res) => {
	res.status(200).json({
		message: "api home",
	});
});

// declare routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/recipes", recipeRouter);
app.use("/api/v1/reviews", reviewRouter);

export { app }; // you can export default also
