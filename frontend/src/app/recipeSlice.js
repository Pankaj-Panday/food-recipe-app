import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import recipeService from "../services/recipe.service";

// createAsyncthunk will automatically dispatch a recipes/fetchSingleRecipe/fulfilled action with
// required data or recipes/fetchSingleRecipe/rejected action with error when error occurs so just handle
// state update of these in extraReducers
export const fetchSingleRecipe = createAsyncThunk(
	"recipes/fetchSingleRecipe",
	async (recipeId, { rejectWithValue }) => {
		try {
			const { data } = await recipeService.viewRecipe(recipeId);
			return data;
		} catch (error) {
			return rejectWithValue(error.reason);
		}
	}
);

const recipesSlice = createSlice({
	name: "recipes",
	initialState: {
		recipes: [],
		selectedRecipe: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchSingleRecipe.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(fetchSingleRecipe.fulfilled, (state, action) => {
				state.loading = false;
				state.selectedRecipe = action.payload;
			})
			.addCase(fetchSingleRecipe.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload; // since we rejectWithValue the error data is recieved in payload
			});
	},
});

export const {} = recipesSlice.actions;
export default recipesSlice.reducer;
