import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isLoggedIn: false,
	user: null,
	loading: false,
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
		setAuthLoading: (state, action) => {
			state.loading = action.payload;
		},
	},
});

export const { userLogin, userLogout, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
