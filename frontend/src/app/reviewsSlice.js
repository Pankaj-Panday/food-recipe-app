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
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchReviews.pending, (state, action) => {
				state.loading = true;
			})
			.addCase(fetchReviews.fulfilled, (state, action) => {
				state.loading = false;
				state.reviews = action.payload.reviews;
			})
			.addCase(fetchReviews.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const {} = reviewsSlice.actions;
export default reviewsSlice.reducer;
