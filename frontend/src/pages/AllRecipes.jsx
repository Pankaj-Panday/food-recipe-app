import React from "react";
import { Container, RecipeGrid } from "../components";

const AllRecipes = () => {
	return (
		<Container>
			<article className="px-10 py-16">
				<h2 className="text-4xl font-bold">All Recipes</h2>
				<p className="py-5">
					&quot; Create a delicious recipe every day &quot; is our guiding
					principle here at Recipes. We're passionate about bringing you a
					diverse array of culinary delights that cater to every taste and
					occasion. From comforting classics to innovative twists on traditional
					favorites, our goal is to inspire your culinary adventures and spark
					joy in your kitchen. Each recipe is crafted with care, selecting the
					finest ingredients and employing tried-and-true techniques to ensure
					delicious results every time. So whether you're a seasoned chef or a
					novice cook, join us on this delicious journey as we explore the
					vibrant tapestry of flavors that the world has to offer. With a new
					recipe to discover each day, there's always something exciting cooking
					at Recipes{" "}
				</p>
				<hr />
				<RecipeGrid />
			</article>
		</Container>
	);
};

export default AllRecipes;
