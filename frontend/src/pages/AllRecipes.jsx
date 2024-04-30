import React from "react";
import { Container, RecipeGrid } from "../components";

const AllRecipes = () => {
	return (
		<Container>
			<article className="py-8 md:py-16 sm:px-5 md:px-10 min-h-[200px]">
				<h2 className="text-4xl font-bold">All Recipes</h2>
				<p className="py-5">
					&quot; Create a delicious recipe every day &quot; is our guiding
					principle here at Recipes. We're passionate about bringing you a
					diverse array of culinary delights that cater to every taste and
					occasion. From comforting classics to innovative twists on traditional
					favorites, our goal is to inspire your culinary adventures and spark
					joy in your kitchen.
				</p>
				<hr />
				<RecipeGrid />
			</article>
		</Container>
	);
};

export default AllRecipes;
