import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import recipesReducer from "./recipesSlice.js";
import reviewsReducer from "./reviewsSlice.js";
import menuReducer from "./menuSlice.js";
import searchReducer from "./searchSlice.js";
import userReducer from "./userSlice.js";

const store = configureStore({
	reducer: {
		auth: authReducer,
		user: userReducer,
		recipes: recipesReducer,
		reviews: reviewsReducer,
		menu: menuReducer,
		searchBar: searchReducer,
	},
});

export default store;
