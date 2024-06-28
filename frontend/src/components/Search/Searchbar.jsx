import React, { useState, useEffect, useRef, useCallback } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import {
  Button,
  Input,
  SearchResults,
  NoResults,
  SearchError,
  SearchLoading,
} from "../index.js";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSuggestions,
  searchRecipe,
  fetchRecipesByName,
} from "../../app/searchSlice.js";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import { closeMenu } from "../../app/menuSlice.js";

const Searchbar = () => {
  let inputRef = useRef(null);
  let abortControllerRef = useRef(null);
  const { focus: searchBarFocus, searchInitiated } = useSelector(
    (state) => state.searchBar,
  );

  const {
    loading: loadingSuggestions,
    error: errorSuggestion,
    data: suggestedRecipesData,
  } = useSelector((state) => state.searchBar.suggestedRecipes);

  const {
    loading: loadingSearchedRecipes,
    error: errorSearchedRecipes,
    data: searchedRecipesData,
  } = useSelector((state) => state.searchBar.searchedRecipes);

  const [recipeToSearch, setRecipeToSearch] = useState({
    _id: "",
    title: "",
  });
  const [activeIndex, setActiveIndex] = useState(null);
  const [autoComplete, setAutoComplete] = useState(true);

  const menuOpen = useSelector((state) => state.menu.show);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const debounceDelay = 400;

  const debouncedSearch = useCallback(
    debounce((recipeToSearch) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      dispatch(searchRecipe({ title: recipeToSearch, signal }));
    }, debounceDelay),
    [debounceDelay],
  );

  const handleChange = (e) => {
    const searchVal = e.target.value;
    setRecipeToSearch({
      _id: null,
      title: searchVal,
    });
    if (!searchVal?.trim() || !autoComplete) {
      dispatch(clearSuggestions());
      setActiveIndex(null);
      return;
    }
    debouncedSearch(searchVal);
  };

  const handleKeyDown = (e) => {
    const { keyCode } = e;
    if (recipeToSearch) {
      if (keyCode === 13) {
        // Enter
        if (activeIndex === null) return;
        setRecipeToSearch(suggestedRecipesData[activeIndex]);
        setAutoComplete(false);
        setActiveIndex(null);
        dispatch(clearSuggestions());
        return;
      }
      setAutoComplete(true);
      if (keyCode === 40 && suggestedRecipesData?.length > 0) {
        // Arrow down
        if (
          activeIndex === null ||
          activeIndex === suggestedRecipesData?.length - 1
        ) {
          setActiveIndex(0);
        } else {
          setActiveIndex((prevIndex) => prevIndex + 1);
        }
      } else if (keyCode === 38 && suggestedRecipesData?.length > 0) {
        // Arrow up
        if (activeIndex === null || activeIndex === 0) {
          setActiveIndex(suggestedRecipesData.length - 1);
        } else {
          setActiveIndex((prevIndex) => prevIndex - 1);
        }
      }
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    setAutoComplete(false);
    dispatch(clearSuggestions());
    // check if mobile header is set
    if (menuOpen) {
      dispatch(closeMenu());
      document.querySelector("body").style.overflow = "unset";
    }
    if (recipeToSearch?._id) {
      navigate(`/view-recipe/${recipeToSearch._id}`);
    } else if (recipeToSearch?.title) {
      dispatch(fetchRecipesByName(recipeToSearch.title));
      navigate(`/searched-recipes`);
    }
  };

  useEffect(() => {
    if (searchBarFocus) {
      inputRef.current.focus();
    }
  }, [searchBarFocus]);

  return (
    <div className="relative">
      <form onSubmit={handleClick} className="relative flex sm:w-96">
        <input
          type="text"
          placeholder="Find a recipe"
          className="w-full border-2 border-brand-primary px-2 py-2 outline-none duration-200 focus:border-brand-primary focus:bg-slate-50 focus:outline-none"
          value={recipeToSearch.title}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          autoComplete="off"
        />
        <Button
          type="button"
          className="grid w-10 place-items-center bg-brand-primary py-1 text-xl text-white"
          onClick={handleClick}
        >
          <BiSearchAlt2 className="inline-block align-middle" />
        </Button>
      </form>
      {recipeToSearch?.title &&
        loadingSuggestions &&
        searchInitiated &&
        autoComplete && <SearchLoading />}
      {recipeToSearch?.title &&
        autoComplete &&
        !loadingSuggestions &&
        !errorSuggestion &&
        suggestedRecipesData?.length > 0 && (
          <SearchResults
            results={suggestedRecipesData}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            recipeToSearch={recipeToSearch}
            setAutoComplete={setAutoComplete}
            setRecipeToSearch={setRecipeToSearch}
          />
        )}
      {recipeToSearch?.title &&
        autoComplete &&
        searchInitiated &&
        !loadingSuggestions &&
        !errorSuggestion &&
        suggestedRecipesData?.length === 0 && <NoResults />}
      {recipeToSearch?.title &&
        errorSuggestion &&
        !loadingSuggestions &&
        autoComplete && <SearchError />}
    </div>
  );
};

export default Searchbar;
