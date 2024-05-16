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

export const fetchItems = createAsyncThunk(
	"recipes/fetchRecipes",
	async (
		{ pageNum, limit },
		{ rejectWithValue, dispatch, signal, getState }
	) => {
		try {
			const state = getState().recipes;
			const { data } = await recipeService.viewAllRecipes(
				pageNum,
				limit,
				signal
			);

			if (state.fetchedPage === 1) {
				dispatch(
					setCurrentPageData(data.recipes.slice(0, state.itemsDisplayedPerPage))
				);
				dispatch(
					setNextPageData(data.recipes.slice(state.itemsDisplayedPerPage))
				);
				dispatch(setPrevPageData([]));
			}
			dispatch(setFetchedPage(data.curPageNum));

			dispatch(setTotalItemsAvailable(data.totalRecipeCount));
			dispatch(setTotalPagesAvailable(data.totalPages));
			dispatch(
				setTotalPagesToDisplay(
					Math.ceil(data.totalRecipeCount / state.itemsDisplayedPerPage)
				)
			);
			return data;
		} catch (error) {
			return rejectWithValue(error.reason);
		}
	}
);

export const fetchFeaturedItems = createAsyncThunk(
	"recipes/fetchFeaturedRecipes",
	async (_, { signal, rejectWithValue }) => {
		try {
			const { data } = await recipeService.getRandomRecipes(signal);
			return data;
		} catch (error) {
			return rejectWithValue(error.reason);
		}
	}
);

const initialState = {
	selectedRecipe: null,
	curPageData: [],
	nextPageData: [],
	prevPageData: [],
	fetchedData: [],
	fetchedPage: 1,
	loading: false,
	error: null,
	totalItemsAvailable: 0,
	totalPagesAvailable: 0,
	itemsDisplayedPerPage: 12,
	totalPagesToDisplay: 0,
	curDisplayedPage: 1,
};

const recipesSlice = createSlice({
	name: "recipes",
	initialState,
	reducers: {
		resetState: () => {
			return initialState;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
		setTotalItemsAvailable: (state, action) => {
			state.totalItemsAvailable = action.payload;
		},
		setItemsDisplayedPerPage: (state, action) => {
			state.itemsDisplayedPerPage = action.payload;
		},
		setCurrentPageData: (state, action) => {
			state.curPageData = action.payload;
		},
		setNextPageData: (state, action) => {
			state.nextPageData = action.payload;
		},
		setPrevPageData: (state, action) => {
			state.prevPageData = action.payload;
		},
		setFetchedPage: (state, action) => {
			state.fetchedPage = action.payload;
		},
		setTotalPagesAvailable: (state, action) => {
			state.totalPagesAvailable = action.payload;
		},
		setTotalPagesToDisplay: (state, action) => {
			state.totalPagesToDisplay = action.payload;
		},
		setCurDisplayedPage: (state, action) => {
			state.curDisplayedPage = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchSingleRecipe.pending, (state, action) => {
				state.loading = true;
				state.error = null;
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
				state.loading = false;
				state.error = null;
				state.fetchedData = [...action.payload.recipes];
			})
			.addCase(fetchItems.rejected, (state, action) => {
				if (action.meta.aborted) {
					state.loading = true;
				} else {
					state.loading = false;
					state.error = action.payload;
				}
			});

		builder
			.addCase(fetchFeaturedItems.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(fetchFeaturedItems.fulfilled, (state, action) => {
				state.curPageData = action.payload;
				state.loading = false;
				state.error = null;
			})
			.addCase(fetchFeaturedItems.rejected, (state, action) => {
				if (action.meta.aborted) {
					state.loading = true;
				} else {
					state.loading = false;
					state.error = action.payload;
				}
			});
	},
});

export const {
	resetState,
	setLoading,
	setError,
	setTotalItemsAvailable,
	setItemsDisplayedPerPage,
	setCurrentPageData,
	setNextPageData,
	setPrevPageData,
	setFetchedPage,
	setTotalPagesAvailable,
	setTotalPagesToDisplay,
	setCurDisplayedPage,
} = recipesSlice.actions;

export default recipesSlice.reducer;
