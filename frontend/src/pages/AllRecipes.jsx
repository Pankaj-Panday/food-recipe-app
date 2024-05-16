import React, { useEffect } from "react";
import { Container, RecipeGrid, PaginationButtons } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { fetchItems, resetState } from "../app/recipesSlice";

const AllRecipes = () => {
	const dispatch = useDispatch();
	const loading = useSelector((state) => state.recipes.loading);
	const error = useSelector((state) => state.recipes.error);
	const displayedItems = useSelector((state) => state.recipes.curPageData);
	const itemsDisplayedPerPage = useSelector(
		(state) => state.recipes.itemsDisplayedPerPage
	);

	useEffect(() => {
		const promise = dispatch(
			fetchItems({ pageNum: 1, limit: itemsDisplayedPerPage * 2 })
		);

		return () => {
			promise.abort();
			dispatch(resetState());
		};
	}, [dispatch, itemsDisplayedPerPage]);

	let content;

	if (loading) {
		content = (
			<div className="my-5 text-center text-gray-400 se sm:my-10 min-h-[30vh] flex items-center justify-center">
				<p className="mb-2 tracking-wide">Please wait. Loading recipes...</p>
			</div>
		);
	} else if (error && displayedItems?.length === 0) {
		content = (
			<div className="my-5 text-center text-gray-400 se sm:my-10 min-h-[30vh] flex items-center justify-center">
				<p className="mb-2 tracking-wide">
					Error: There is some problem fetching recipes
				</p>
			</div>
		);
	} else {
		content = (
			<>
				<RecipeGrid recipes={displayedItems} />
				<PaginationButtons />
			</>
		);
	}

	return (
		<Container>
			<article className="py-10 md:py-12 sm:px-5 md:px-10">
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
				{content}
			</article>
		</Container>
	);
};

export default AllRecipes;
