import React from "react";
import { Button, Rating } from "../components/";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  const navigate = useNavigate();
  return (
    <div
      className="relative h-full w-full cursor-pointer rounded-md border shadow-lg transition-all duration-150 hover:scale-[1.01] hover:shadow-2xl"
      onClick={() => navigate(`/view-recipe/${recipe._id}`)}
    >
      {" "}
      <div className="flex aspect-video min-w-[278px] items-center justify-center overflow-hidden rounded-t-md bg-[linear-gradient(352deg,rgba(2,0,36,1)0%,rgba(8,8,40,1)39%,rgba(131,131,131,1)100%)]">
        {recipe?.recipePhoto?.url ? (
          <img
            className="h-full w-full object-cover"
            src={recipe?.recipePhoto.url}
            alt={recipe?.title}
          />
        ) : (
          <p className="text-xs text-white">Photo not available</p>
        )}
      </div>
      <div className="min-h-36 p-3">
        <h3 className="text-2xl font-bold tracking-tighter">{recipe?.title}</h3>
        <div className="my-3 flex justify-between">
          {recipe.totalReviews > 0 && (
            <span>
              <Rating rating={recipe?.avgRating} />
            </span>
          )}
          <span>{recipe.totalReviews} reviews</span>
        </div>
        <p className="text-sm">{recipe.cookingTime} mins</p>
      </div>
    </div>
  );
};

export default RecipeCard;
