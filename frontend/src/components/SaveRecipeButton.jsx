import React from "react";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { Button } from ".";
import { useDispatch } from "react-redux";
import { saveRecipe, unsaveRecipe } from "../app/recipesSlice";

const SaveRecipeButton = ({ isSaved, recipeId }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    if (!isSaved) {
      dispatch(saveRecipe(recipeId));
    } else {
      dispatch(unsaveRecipe(recipeId));
    }
  };

  return (
    <Button
      className="flex min-w-[100px] items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-center hover:bg-[#d64f1f] active:bg-[#d64f1f]"
      onClick={handleClick}
    >
      <span>{isSaved ? "Saved" : "Save"}</span>
      {isSaved ? (
        <IoMdHeart className="text-lg" />
      ) : (
        <IoMdHeartEmpty className="text-lg" />
      )}
    </Button>
  );
};

export default SaveRecipeButton;
