import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/user.service";

export const fetchUserById = createAsyncThunk(
	"users/fetchUserDetails",
	async (userId, { rejectWithValue, signal }) => {
		try {
			const { data } = await userService.getUserDetailsById(userId, signal);
			return data;
		} catch (error) {
			return rejectWithValue(error.reason);
		}
	}
);

const userSlice = createSlice({
	name: "user",
	initialState: {
		userDetails: null,
		loading: false,
		error: null,
	},
	reducers: {
		setUserDetails: (state, action) => {
			state.userDetails = action.payload;
		},
		resetUserDetails: (state, action) => {
			// i could return initialstate too but doing it manually here
			state.userDetails = null;
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserById.pending, (state, action) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUserById.fulfilled, (state, action) => {
				state.loading = false;
				state.error = null;
				state.userDetails = action.payload;
			})
			.addCase(fetchUserById.rejected, (state, action) => {
				state.loading = fasle;
				state.error = action.payload;
			});
	},
});

export const { setUserDetails } = userSlice.actions;
export default userSlice.reducer;
