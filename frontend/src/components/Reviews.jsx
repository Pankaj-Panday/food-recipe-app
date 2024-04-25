import React, { useEffect } from "react";
import { AvgRating, TimeAgo } from "./index.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../app/reviewsSlice.js";
import { Link } from "react-router-dom";

const Reviews = ({ recipeId }) => {
	const dispatch = useDispatch();
	const { reviews, loading, error } = useSelector((state) => state.reviews);

	useEffect(() => {
		dispatch(fetchReviews({ recipeId: recipeId }));
	}, [recipeId, dispatch]);

	return (
		<ul className="flex flex-col gap-y-5">
			{reviews.map((review) => {
				return (
					<li
						key={review._id}
						className="max-w-2xl py-5 text-sm border-gray-300 border-y"
					>
						<header className="flex items-center gap-2 mb-3">
							<div className="w-8 h-8 overflow-hidden rounded-full">
								<img
									className="object-cover object-center w-full h-full"
									src={review?.owner.avatar || "/userDefaultDp.jpg"}
								/>
							</div>
							<p className="capitalize">
								<Link to={`/users/${review.owner._id}`}>
									{review.owner.name}
								</Link>
							</p>
						</header>
						<div className="flex gap-5 mb-2">
							<AvgRating rating={review.rating} />
							<TimeAgo timestamp={review.updatedAt} />
						</div>
						<p className="text-sm">{review.comment}</p>
					</li>
				);
			})}
		</ul>
	);
};

export default Reviews;
