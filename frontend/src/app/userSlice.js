import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
	name: "user",
	initialState: null,
	reducers: {
		case1: (state, action) => {
			const updatedValue = action.payload;
			state.someValue = updatedValue;
		},
		case2: (state, action) => {
			const updatedValue = action.payload;
			state.someValue = updatedValue;
		},
	},
});

export const { case1, case2 } = userSlice.actions;
export default userSlice.reducer;
