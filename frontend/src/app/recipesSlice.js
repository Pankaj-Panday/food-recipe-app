import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import recipeService from "../services/recipe.service";

// createAsyncthunk will automatically dispatch a recipes/fetchSingleRecipe/fulfilled action with
// required data or recipes/fetchSingleRecipe/rejected action with error when error occurs so just handle
// state update of these in extraReducers

const initialState = {
	fetchedItems: [], // from backend
	fetchedItemsCount: 9, // tell how many items to fetch from backend
	fetchedPage: 0, // from backend
	totalPagesAvailable: null, // from backend
	totalItemsAvailable: 0, // from backend
	displayedItems: [], // from frontend
	totalDisplayedPages: 0, // from frontend
	displayedPage: 1, // from frontend
	selectedRecipe: null,
	loading: false,
	error: null,
	startIndex: 0,
	itemsDisplayedPerPage: 3, // from frontend
	endIndex: 3,
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

export const fetchItems = createAsyncThunk(
	"recipes/fetchRecipes",
	async ({ pageNum, limit }, { rejectWithValue, signal }) => {
		try {
			const { data } = await recipeService.viewAllRecipes(
				pageNum,
				limit,
				signal
			);
			return data;
		} catch (error) {
			return rejectWithValue(error.reason);
		}
	}
);

const recipesSlice = createSlice({
	name: "recipes",
	initialState,
	reducers: {
		setStartIndex: (state, action) => {
			state.startIndex = action.payload;
		},
		setEndIndex: (state, action) => {
			state.endIndex = action.payload;
		},
		setFetchedPage: (state, action) => {
			state.fetchedPage = action.payload;
		},
		setdisplayedItems: (state, action) => {
			state.displayedItems = state.fetchedItems.slice(
				state.startIndex,
				state.endIndex
			);
		},
		setFetchedItemsCount: (state, action) => {
			state.fetchedItemsCount = action.payload;
		},
		incrementDisplayedPage: (state, action) => {
			state.displayedPage = state.displayedPage + 1;
		},
		decrementDisplayedPage: (state, action) => {
			state.displayedPage = state.displayedPage - 1;
		},
		setTotalDisplayedPages: (state) => {
			state.totalDisplayedPages = Math.ceil(
				state.totalItemsAvailable / state.itemsDisplayedPerPage
			);
		},
	},
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
			.addCase(fetchItems.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(fetchItems.fulfilled, (state, action) => {
				state.fetchedItems = [...action.payload.recipes];
				state.totalItemsAvailable = action.payload.totalRecipeCount;
				state.totalPagesAvailable = action.payload.totalPages;
				state.fetchedPage = action.payload.curPageNum;
				state.loading = false;
				state.error = null;
			})
			.addCase(fetchItems.rejected, (state, action) => {
				state.loading = false;
				if (!action.meta.aborted) {
					state.error = action.payload;
				}
			});
	},
});

export const {
	setStartIndex,
	setEndIndex,
	setdisplayedItems,
	incrementDisplayedPage,
	decrementDisplayedPage,
	setTotalDisplayedPages,
	setFetchedItemsCount,
	setFetchedPage,
} = recipesSlice.actions;
export default recipesSlice.reducer;
