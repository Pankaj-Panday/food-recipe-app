import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reviewService from "../services/review.service";

const initialState = {
	fetchedReviews: [],
	displayedReviews: [],
	currentPage: 1,
	totalPages: 0,
	loading: false,
	error: null,
};

export const fetchReviews = createAsyncThunk(
	"reviews/fetchReviews",
	async ({ recipeId, pageNum }, { dispatch, rejectWithValue, signal }) => {
		try {
			const { data } = await reviewService.allReviewsOnRecipe(
				recipeId,
				pageNum,
				signal
			);
			dispatch(setCurrentPage(data.curPage));
			dispatch(setTotalPages(data.totalPages));
			return data;
		} catch (error) {
			return rejectWithValue(error.reason);
		}
	}
);

const reviewsSlice = createSlice({
	name: "reviews",
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
		setDisplayedReviews: (state, action) => {
			state.displayedReviews = [...state.displayedReviews, ...action.payload];
		},
		setCurrentPage: (state, action) => {
			state.currentPage = action.payload;
		},
		setTotalPages: (state, action) => {
			state.totalPages = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchReviews.pending, (state, action) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchReviews.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.fetchedReviews = [...action.payload.reviews];
			})
			.addCase(fetchReviews.rejected, (state, action) => {
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
	setDisplayedReviews,
	setCurrentPage,
	setTotalPages,
} = reviewsSlice.actions;
export default reviewsSlice.reducer;
