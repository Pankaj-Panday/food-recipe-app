import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import recipesReducer from "./recipesSlice.js";
import reviewsReducer from "./reviewsSlice.js";

const store = configureStore({
	reducer: {
		auth: authReducer,
		recipes: recipesReducer,
		reviews: reviewsReducer,
	},
});

export default store;
