import React, { useEffect } from "react";
import { PaginationButtons, RecipeCard } from ".";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems } from "../app/recipesSlice";

const RecipeGrid = () => {
	const dispatch = useDispatch();
	const loading = useSelector((state) => state.recipes.loading);
	const error = useSelector((state) => state.recipes.error);
	const itemsDisplayedPerPage = useSelector(
		(state) => state.recipes.itemsDisplayedPerPage
	);
	const displayedItems = useSelector((state) => state.recipes.curPageData);

	useEffect(() => {
		const promise = dispatch(
			fetchItems({ pageNum: 1, limit: itemsDisplayedPerPage * 2 })
		);

		return () => {
			promise.abort();
		};
	}, [dispatch, itemsDisplayedPerPage]);

	if (loading) {
		return (
			<div className="my-5 text-center text-gray-400 se sm:my-10 min-h-[30vh]">
				<p className="mb-2 tracking-wide">Please wait. Loading recipes...</p>
			</div>
		);
	} else if (error && displayedItems?.length === 0) {
		return (
			<div className="my-5 text-center text-gray-400 se sm:my-10 min-h-[30vh] flex items-center justify-center">
				<p className="mb-2 tracking-wide">
					Error: There is some problem fetching recipes
				</p>
			</div>
		);
	} else if (displayedItems.length > 0) {
		return (
			<>
				<ul className="grid py-10 md:mx-auto xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 max-sm:min-w-[280px] gap-x-4 gap-y-4 sm:gap-y-8 max-sm:max-w-[400px] mx-auto">
					{displayedItems?.map((recipe) => {
						return (
							<li key={recipe._id}>
								<RecipeCard recipe={recipe} />
							</li>
						);
					})}
				</ul>
				<PaginationButtons />
			</>
		);
	}
};

export default RecipeGrid;
