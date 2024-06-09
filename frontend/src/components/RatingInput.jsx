import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { IoStarSharp } from "react-icons/io5";

const RatingInput = ({ label, required, newline = true, className, name }) => {
  const { register, getValues } = useFormContext();

  let newlineClass = newline ? "block mt-2 w-full" : "";
  let requiredClass = required
    ? "after:content-['*'] after:text-red-500 after:ml-0.5"
    : "";

  const [hoveredStars, setHoveredStars] = useState(0);
  const [selectedStars, setSelectedStars] = useState(0);

  const shouldFillStar = (starNumber) => {
    if (!selectedStars) {
      return hoveredStars >= starNumber;
    } else {
      if (hoveredStars) {
        return hoveredStars >= starNumber;
      } else {
        return selectedStars >= starNumber;
      }
    }
  };

  const ratingVal = getValues("rating");

  useEffect(() => {
    setSelectedStars(ratingVal);
  }, [setSelectedStars, ratingVal]);

  return (
    <div>
      <label className={`${requiredClass}`}>{label}</label>
      <div className={`inline-flex ${newlineClass} ${className}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <label
            key={star}
            htmlFor={`star${star}`}
            tabIndex={0}
            className="relative pr-2"
            onMouseEnter={() => setHoveredStars(star)}
            onMouseLeave={() => setHoveredStars(0)}
            onClick={() => setSelectedStars(star)}
          >
            <IoStarSharp
              className={`cursor-pointer stroke-brand-primary stroke-[24px] text-3xl ${
                shouldFillStar(star) ? "fill-brand-primary" : "fill-none"
              }`}
            />
            <input
              tabIndex={-1}
              id={`star${star}`}
              type="radio"
              className="sr-only"
              value={star}
              {...register(name, {
                required: "Rating is required",
                min: 1,
                max: 5,
                valueAsNumber: true,
              })}
            />
          </label>
        ))}
      </div>
    </div>
  );
};
export default RatingInput;
