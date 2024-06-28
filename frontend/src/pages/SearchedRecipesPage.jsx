import React from "react";
import { Container, RecipeGrid } from "../components";
import { useSelector } from "react-redux";

const SearchedRecipesPage = () => {
  const { loading, data } = useSelector(
    (state) => state.searchBar.searchedRecipes,
  );

  return (
    <article className="p-6 md:p-10">
      <Container>
        <h2 className="text-2xl font-bold">Search Results</h2>
        {loading ? (
          <div className="flex min-h-[327px] items-center justify-center py-10">
            <p className="text-xl text-gray-500">Loading...</p>
          </div>
        ) : (
          <RecipeGrid recipes={data} />
        )}
      </Container>
    </article>
  );
};

export default SearchedRecipesPage;
