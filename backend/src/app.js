import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: "16kb" })); // just to see its options
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //just to see its options
app.use(cookieParser());

// import routes
import userRouter from "./routes/user.routes.js";
import recipeRouter from "./routes/recipe.routes.js";

// declare routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/recipes", recipeRouter);

export { app }; // you can export default also
