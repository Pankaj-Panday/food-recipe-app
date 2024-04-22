import { createSlice } from "@reduxjs/toolkit";

const recipeSlice = createSlice({
	name: "recipe",
	initialState: {
		recipes: [],
		selectedRecipe: null,
		loading: false,
		error: null,
	},
	reducers: {},
});

export const {} = recipeSlice.actions;
export default recipeSlice.reducer;
