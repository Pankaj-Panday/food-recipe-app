import React from "react";
import { RecipeCard } from ".";

const RecipeGrid = () => {
	return (
		<section className="grid grid-cols-4 gap-4 py-10">
			{/* All recipes here */}
			<RecipeCard />
			<RecipeCard />
			<RecipeCard />
			<RecipeCard />
			<RecipeCard />
			<RecipeCard />
			<RecipeCard />
			<RecipeCard />
			<RecipeCard />
		</section>
	);
};

export default RecipeGrid;
