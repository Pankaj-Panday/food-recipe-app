import React, { useEffect, useLayoutEffect } from "react";
import { Button, Rating, TimeAgo } from "./index.js";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
	fetchReviews,
	resetState,
	setDisplayedReviews,
} from "../app/reviewsSlice.js";

const Reviews = () => {
	const dispatch = useDispatch();

	const recipeId = useSelector((state) => state.recipes.selectedRecipe._id);

	const loading = useSelector((state) => state.reviews.loading);
	const error = useSelector((state) => state.reviews.error);
	const currentPage = useSelector((state) => state.reviews.currentPage);
	const totalPages = useSelector((state) => state.reviews.totalPages);
	const displayedReviews = useSelector(
		(state) => state.reviews.displayedReviews
	);

	const hasMoreReviews = currentPage < totalPages;

	useEffect(() => {
		const promise = dispatch(fetchReviews({ recipeId: recipeId, pageNum: 1 }));
		promise
			.unwrap()
			.then((data) => {
				dispatch(setDisplayedReviews(data.reviews));
			})
			.catch((err) => {}); // no need to do anything, its just catching the aborted promise error

		return () => {
			promise.abort();
			dispatch(resetState());
		};
	}, [dispatch, recipeId]);

	const handleLoadReviews = async () => {
		if (hasMoreReviews) {
			const data = await dispatch(
				fetchReviews({ recipeId: recipeId, pageNum: currentPage + 1 })
			).unwrap();
			dispatch(setDisplayedReviews(data.reviews));
		}
	};

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
					{displayedReviews.map((review) => (
						<Review key={review?._id} review={review} />
					))}
				</ul>
				{hasMoreReviews && (
					<Button
						bgColor="bg-transparent"
						textColor="text-black"
						className="mt-8 relative before:absolute before:h-[1px] before:bg-brand-primary before:w-full before:top-full text-sm"
						onClick={handleLoadReviews}
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
