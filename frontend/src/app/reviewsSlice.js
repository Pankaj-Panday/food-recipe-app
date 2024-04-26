import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reviewService from "../services/review.service";

export const fetchReviews = createAsyncThunk(
	"reviews/fetchReviews",
	async ({ recipeId, pageNum }, { rejectWithValue }) => {
		try {
			const { data } = await reviewService.allReviewsOnRecipe(
				recipeId,
				pageNum
			);
			return data;
		} catch (error) {
			return rejectWithValue(error.reason);
		}
	}
);

const reviewsSlice = createSlice({
	name: "reviews",
	initialState: {
		reviews: [],
		selectedReview: null,
		loading: false,
		error: null, // made it to be string (not object)
		pagination: {
			totalReviews: 0,
			reviewsShown: 0,
			offset: 0,
			hasPrevPage: false,
			hasNextPage: false,
			prevPage: null,
			nextPage: null,
			curPage: null,
		},
	},
	reducers: {
		resetReviews: (state, action) => {
			state.reviews = [];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchReviews.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(fetchReviews.fulfilled, (state, action) => {
				const {
					reviews,
					totalReviews,
					reviewsShown,
					offset,
					hasPrevPage,
					hasNextPage,
					prevPage,
					nextPage,
					curPage,
				} = action.payload;
				state.loading = false;
				state.reviews = [...state.reviews, ...reviews];
				state.pagination = {
					totalReviews,
					reviewsShown,
					offset,
					hasPrevPage,
					hasNextPage,
					prevPage,
					nextPage,
					curPage,
				};
			})
			.addCase(fetchReviews.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { resetReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;
