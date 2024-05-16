import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import recipesReducer from "./recipesSlice.js";
import reviewsReducer from "./reviewsSlice.js";
import menuReducer from "./menuSlice.js";
import searchReducer from "./searchSlice.js";

const store = configureStore({
	reducer: {
		auth: authReducer,
		recipes: recipesReducer,
		reviews: reviewsReducer,
		menu: menuReducer,
		searchBar: searchReducer,
	},
});

export default store;
