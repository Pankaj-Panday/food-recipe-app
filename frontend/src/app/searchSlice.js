import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import recipeService from "../services/recipe.service";

export const searchRecipe = createAsyncThunk(
  "recipes/search",
  async ({ title, signal }, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await recipeService.searchRecipe(title, signal);
      return data.recipes;
    } catch (error) {
      return rejectWithValue(error.reason);
    }
  },
);

export const fetchRecipesByName = createAsyncThunk(
  "recipes/fetchSingleRecipeByName",
  async (recipeName, { rejectWithValue }) => {
    try {
      const { data } = await recipeService.viewRecipesByName(recipeName);
      return data;
    } catch (error) {
      return rejectWithValue(error.reason);
    }
  },
);

// maintain two separate loading & error states for searched recipes and suggested recipes
// because it is creating problem when searching for recipe suggestions on searched-results page

const searchSlice = createSlice({
  name: "searchBar",
  initialState: {
    focus: false,
    searchInitiated: false,
    suggestedRecipes: {
      loading: false,
      error: null,
      data: [],
    },
    searchedRecipes: {
      loading: false,
      error: null,
      data: [],
    },
  },
  reducers: {
    setFocus: (state, action) => {
      state.focus = true;
    },
    removeFocus: (state, action) => {
      state.focus = false;
    },
    clearSuggestions: (state, action) => {
      state.suggestedRecipes = {
        loading: false,
        error: null,
        data: [],
      };
      state.searchInitiated = false;
    },
    clearSearchedRecipes: (state) => {
      state.searchedRecipes = {
        loading: false,
        error: null,
        data: [],
      };
      state.searchInitiated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchRecipe.pending, (state, action) => {
        state.suggestedRecipes.loading = true;
        state.suggestedRecipes.error = null;
        state.searchInitiated = true;
      })
      .addCase(searchRecipe.fulfilled, (state, action) => {
        state.suggestedRecipes.loading = false;
        state.suggestedRecipes.error = null;
        state.suggestedRecipes.data = action.payload;
      })
      .addCase(searchRecipe.rejected, (state, action) => {
        if (action.payload !== "Request was aborted") {
          state.suggestedRecipes.loading = false;
          state.suggestedRecipes.error = action.payload;
        }
      })
      .addCase(fetchRecipesByName.pending, (state, action) => {
        state.searchedRecipes.loading = true;
        state.searchedRecipes.error = null;
      })
      .addCase(fetchRecipesByName.fulfilled, (state, action) => {
        state.searchedRecipes.data = action.payload;
        state.searchedRecipes.loading = false;
        state.searchedRecipes.error = null;
      })
      .addCase(fetchRecipesByName.rejected, (state, action) => {
        state.searchedRecipes.loading = false;
        state.searchedRecipes.data = [];
        state.searchedRecipes.error = action.payload;
      });
  },
});

export const { setFocus, removeFocus, clearSuggestions, clearSearchedRecipes } =
  searchSlice.actions;
export default searchSlice.reducer;
