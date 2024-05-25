import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reviewService from "../services/review.service";

const initialState = {
	fetchedReviews: [],
	selectedReviewLoading: false,
	selectedReviewError: null,
	selectedReview: null,
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

export const fetchUserReview = createAsyncThunk(
	"reviews/fetchUserReview",
	async ({ userId, recipeId }, { signal, rejectWithValue }) => {
		try {
			const { data } = await reviewService.viewUserReviewOnRecipe(
				userId,
				recipeId,
				signal
			);
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
		showAllReviews: (state, action) => {
			state.displayedReviews.push(...action.payload);
		},
		showFilteredReviews: (state, action) => {
			const { allReviews, loggedInUser } = action.payload;
			const filteredReviews = allReviews.filter((review) => {
				return review.owner._id !== loggedInUser?._id;
			});
			state.displayedReviews.push(...filteredReviews);
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

		builder
			.addCase(fetchUserReview.pending, (state, action) => {
				state.selectedReviewLoading = true;
			})
			.addCase(fetchUserReview.fulfilled, (state, action) => {
				state.selectedReviewLoading = false;
				state.selectedReviewError = null;
				state.selectedReview = action.payload;
			})
			.addCase(fetchUserReview.rejected, (state, action) => {
				state.selectedReviewLoading = false;
				state.selectedReview = null;
				if (!action.meta.aborted && !action.meta.condition) {
					// just for being foolproof that error is from backend not frontend
					state.selectedReviewError = action.payload;
				}
			});
	},
});

export const {
	resetState,
	setLoading,
	setError,
	showAllReviews,
	showFilteredReviews,
	setCurrentPage,
	setTotalPages,
} = reviewsSlice.actions;
export default reviewsSlice.reducer;
