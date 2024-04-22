import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import recipeReducer from "./recipeSlice.js";

const store = configureStore({
	reducer: {
		auth: authReducer,
		recipe: recipeReducer,
	},
});

export default store;
