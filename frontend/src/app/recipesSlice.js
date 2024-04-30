import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import recipeService from "../services/recipe.service";

// createAsyncthunk will automatically dispatch a recipes/fetchSingleRecipe/fulfilled action with
// required data or recipes/fetchSingleRecipe/rejected action with error when error occurs so just handle
// state update of these in extraReducers

const initialState = {
	fetchedRecipes: [],
	paginatedRecipes: [],
	selectedRecipe: null,
	loading: false,
	error: null,
	totalPages: null,
	currentPage: 1,
	itemsPerPage: 4,
};

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

export const fetchRecipes = createAsyncThunk(
	"recipes/fetchRecipes",
	async ({ pageNum, limit }, { rejectWithValue }) => {
		try {
			const { data } = await recipeService.viewAllRecipes(pageNum, limit);
			return data;
		} catch (error) {
			return rejectWithValue(error.reason);
		}
	}
);

const recipesSlice = createSlice({
	name: "recipes",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchSingleRecipe.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(fetchSingleRecipe.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.selectedRecipe = action.payload;
			})
			.addCase(fetchSingleRecipe.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload; // since we rejectWithValue the error data is recieved in payload
			});

		builder
			.addCase(fetchRecipes.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(fetchRecipes.fulfilled, (state, action) => {
				state.fetchedRecipes = [...action.payload.recipes];
				state.loading = false;
				state.error = null;
			})
			.addCase(fetchRecipes.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const {} = recipesSlice.actions;
export default recipesSlice.reducer;
