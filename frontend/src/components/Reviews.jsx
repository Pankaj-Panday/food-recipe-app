import React, { useEffect, useLayoutEffect } from "react";
import { Button, Rating, TimeAgo } from "./index.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, resetReviews } from "../app/reviewsSlice.js";
import { Link } from "react-router-dom";

const Reviews = () => {
	const dispatch = useDispatch();
	const { reviews, loading, error } = useSelector((state) => state.reviews);
	const { nextPage } = useSelector((state) => state.reviews.pagination);
	const { _id: recipeId } = useSelector(
		(state) => state.recipes.selectedRecipe
	);

	useEffect(() => {
		dispatch(fetchReviews({ recipeId: recipeId }));
		return () => {
			dispatch(resetReviews());
		};
	}, [recipeId, dispatch]);

	let content = null;
	if (loading) {
		content = <p className="text-sm text-gray-400">Loading reviews...</p>;
	} else if (error) {
		content = (
			<p className="text-sm text-gray-400">Error loading reviews: {error}</p>
		);
	} else {
		content = (
			<>
				<ul className="flex flex-col gap-y-5">
					{reviews.map((review) => (
						<Review key={review._id} review={review} />
					))}
				</ul>
				{nextPage && (
					<Button
						bgColor="bg-transparent"
						textColor="text-black"
						className="mt-8 relative before:absolute before:h-[1px] before:bg-brand-primary before:w-full before:top-full text-sm"
						onClick={() => {
							dispatch(fetchReviews({ recipeId, pageNum: nextPage }));
						}}
					>
						Load more reviews
					</Button>
				)}
			</>
		);
	}

	return <>{content}</>;
};

const Review = ({ review }) => {
	return (
		<li className="max-w-2xl py-5 text-sm border-gray-300 border-y">
			<header className="flex items-center gap-2 mb-3">
				<div className="w-8 h-8 overflow-hidden rounded-full">
					<img
						className="object-cover object-center w-full h-full"
						src={review?.owner.avatar || "/userDefaultDp.jpg"}
					/>
				</div>
				<p className="font-medium capitalize relative after:absolute after:top-full after:left-0 after:w-full after:bg-brand-primary  after:h-[1px]">
					<Link to={`/users/${review?.owner._id}`}>{review?.owner.name}</Link>
				</p>
			</header>
			<div className="flex gap-5 mb-2">
				<Rating size="1rem" rating={review?.rating} />
				<TimeAgo
					className="text-xs italic text-gray-400"
					timestamp={review?.updatedAt}
				/>
			</div>
			<p className="text-sm">{review?.comment}</p>
		</li>
	);
};

export default Reviews;
