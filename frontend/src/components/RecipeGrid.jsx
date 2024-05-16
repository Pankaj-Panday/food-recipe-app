import React from "react";
import { RecipeCard } from ".";

const RecipeGrid = ({ recipes }) => {
	if (recipes?.length > 0) {
		return (
			<ul className="grid py-10 md:mx-auto xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 max-sm:min-w-[280px] gap-x-4 gap-y-4 sm:gap-y-8 max-sm:max-w-[400px] mx-auto">
				{recipes?.map((recipe) => {
					return (
						<li key={recipe._id}>
							<RecipeCard recipe={recipe} />
						</li>
					);
				})}
			</ul>
		);
	} else {
		return (
			<div className="my-5 text-center text-gray-400 se sm:my-10 min-h-[30vh] flex items-center justify-center">
				<p className="mb-2 tracking-wide">No recipes found</p>
			</div>
		);
	}
};

export default RecipeGrid;
