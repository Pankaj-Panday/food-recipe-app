import React from "react";
import Rating from "../Rating";
import { useNavigate } from "react-router-dom";

const SearchResults = ({
  results,
  activeIndex,
  setActiveIndex,
  setAutoComplete,
  setRecipeToSearch,
}) => {
  const navigate = useNavigate();

  const handleClick = (item) => {
    setRecipeToSearch(item);
    setAutoComplete(false);
    navigate(`/view-recipe/${item._id}`);
  };

  const handleMouseOver = (index) => {
    setActiveIndex(index);
  };

  return (
    <ul className="absolute w-full overflow-auto bg-white shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]">
      {results.map((result, index) => {
        return (
          <li
            key={result._id}
            onClick={() => handleClick(result)}
            onMouseOver={() => handleMouseOver(index)}
            className={
              index === activeIndex
                ? "flex cursor-pointer justify-between bg-gray-200 p-2"
                : "flex cursor-pointer justify-between p-2"
            }
          >
            <span>{result.title}</span>
            <Rating rating={result.avgRating} size="1rem" />
          </li>
        );
      })}
    </ul>
  );
};

export default SearchResults;
