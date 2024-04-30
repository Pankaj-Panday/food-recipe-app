import React, { useEffect } from "react";
import { RecipeCard } from ".";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../app/recipesSlice";
import { Button } from ".";

const RecipeGrid = () => {
	const recipes = useSelector((state) => state.recipes.fetchedRecipes);
	const currentPage = useSelector((state) => state.recipes.currentPage);
	const itemsPerPage = useSelector((state) => state.recipes.itemsPerPage);
	const loading = useSelector((state) => state.recipes.loading);
	const error = useSelector((state) => state.recipes.error);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchRecipes({ pageNum: currentPage, limit: 16 }));
	}, [dispatch, currentPage]);

	if (loading) {
		return (
			<div className="my-5 text-center text-gray-400 se sm:my-10">
				<p className="mb-2 tracking-wide">Please wait. Loading recipes...</p>
			</div>
		);
	} else if (error && recipes?.length === 0) {
		return (
			<div className="my-5 text-center text-gray-400 se sm:my-10">
				<p className="mb-2 tracking-wide">
					Error: There is some problem fetching recipes
				</p>
				<p>Reason: {error?.reason}</p>
			</div>
		);
	} else if (recipes?.length > 0 && !error) {
		return (
			<>
				<ul className="grid py-10 md:mx-auto xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 max-sm:min-w-[280px] gap-x-4 gap-y-4 sm:gap-y-8 max-sm:max-w-[400px] mx-auto">
					{recipes?.map((recipe) => {
						return (
							<li key={recipe._id}>
								<RecipeCard recipe={recipe} />
							</li>
						);
					})}
				</ul>
				{/* <section>
					<div>
						<Button onClick={gotoPrevPage}>Prev</Button>
						<span>
							{curPageNum} of {totalPages}
						</span>
						<Button onClick={gotoNextPage}>Next</Button>
					</div>
				</section> */}
			</>
		);
	}
};

export default RecipeGrid;
