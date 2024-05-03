import React, { useEffect } from "react";
import { RecipeCard } from ".";
import { useDispatch, useSelector } from "react-redux";
import { Button } from ".";
import {
	fetchItems,
	setEndIndex,
	setStartIndex,
	setdisplayedItems,
	setFetchedPage,
} from "../app/recipesSlice";

const RecipeGrid = () => {
	const dispatch = useDispatch();

	const loading = useSelector((state) => state.recipes.loading);
	const error = useSelector((state) => state.recipes.error);

	const itemsDisplayedPerPage = useSelector(
		(state) => state.recipes.itemsDisplayedPerPage
	);
	const displayedItems = useSelector((state) => state.recipes.displayedItems);
	const startIndex = useSelector((state) => state.recipes.startIndex);
	const endIndex = useSelector((state) => state.recipes.endIndex);
	const fetchedItemsCount = useSelector(
		(state) => state.recipes.fetchedItemsCount
	);
	const fetchedPage = useSelector((state) => state.recipes.fetchedPage);
	const totalPagesAvailable = useSelector(
		(state) => state.recipes.totalPagesAvailable
	);

	const handlePrevClick = () => {
		// set startindex and end index and dispatch actions
		if (startIndex === 0 && fetchedPage > 1) {
			// fetch previous page recipes
			console.log("requires fetching of recipes");
		} else {
			dispatch(setEndIndex(startIndex));
			dispatch(setStartIndex(startIndex - itemsDisplayedPerPage));
			dispatch(setdisplayedItems());
		}
	};

	const handleNextClick = () => {
		if (endIndex >= fetchedItemsCount && fetchedPage <= totalPagesAvailable) {
			// the next button of 2nd last page was clicked
			// fetch new recipes
			dispatch(
				fetchItems({ pageNum: fetchedPage + 1, limit: fetchedItemsCount })
			).then(() => {
				dispatch(setStartIndex(0));
				dispatch(setEndIndex(itemsDisplayedPerPage));
				dispatch(setdisplayedItems());
			});
		} else {
			dispatch(setStartIndex(endIndex));
			dispatch(setEndIndex(endIndex + itemsDisplayedPerPage));
			dispatch(setdisplayedItems());
		}
	};

	useEffect(() => {
		const promise = dispatch(
			fetchItems({
				pageNum: 1,
				limit: fetchedItemsCount,
			})
		);
		promise.then(() => {
			dispatch(setdisplayedItems());
		});

		return () => {
			promise.abort();
			dispatch(setStartIndex(0));
			dispatch(setEndIndex(itemsDisplayedPerPage));
		};
	}, [dispatch, fetchedItemsCount, itemsDisplayedPerPage]);

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
				<section>
					<div className="flex gap-3 mx-auto w-[200px]">
						<Button
							onClick={handlePrevClick}
							className="px-4 py-2 rounded-md min-w-20 disabled:bg-[#ffa180] disabled:cursor-not-allowed"
						>
							Prev
						</Button>
						<Button
							onClick={handleNextClick}
							className="px-4 py-2 rounded-md min-w-20 disabled:bg-[#ffa180] disabled:cursor-not-allowed"
						>
							Next
						</Button>
					</div>
				</section>
			</>
		);
	}
};

export default RecipeGrid;
