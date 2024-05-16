import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
	name: "searchBar",
	initialState: {
		focus: false,
	},
	reducers: {
		setFocus: (state, action) => {
			state.focus = true;
		},
		removeFocus: (state, action) => {
			state.focus = false;
		},
	},
});

export const { setFocus, removeFocus } = searchSlice.actions;
export default searchSlice.reducer;
