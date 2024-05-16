import { createSlice } from "@reduxjs/toolkit";

const menuSlice = createSlice({
	name: "menu",
	initialState: {
		show: false,
	},
	reducers: {
		openMenu: (state, action) => {
			state.show = true;
		},
		closeMenu: (state, action) => {
			state.show = false;
		},
	},
});

export const { openMenu, closeMenu } = menuSlice.actions;
export default menuSlice.reducer;
