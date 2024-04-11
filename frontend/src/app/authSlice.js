import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isLoggedIn: false,
	user: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		userLogin: (state, action) => {
			state.isLoggedIn = true;
			state.user = action.payload;
		},
		userLogout: (state, action) => {
			state.isLoggedIn = false;
			state.user = null;
		},
	},
});

export const { userLogin, userLogout } = authSlice.actions;
export default authSlice.reducer;
