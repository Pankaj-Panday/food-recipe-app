import React from "react";
import { IoStarSharp, IoStarHalfSharp, IoStarOutline } from "react-icons/io5";

const Rating = ({ rating, color = "#febf05", size = "1.25rem" }) => {
	const fullStars = Math.floor(rating);
	const halfStar = Math.round(rating - fullStars);
	return (
		<div className="flex items-center">
			{Array.from({ length: 5 }, (_, index) => {
				return (
					<span key={index}>
						{index < fullStars ? (
							<IoStarSharp size={size} color={color} />
						) : halfStar ? (
							<IoStarHalfSharp size={size} color={color} />
						) : (
							<IoStarOutline key={index} size={size} color={color} />
						)}
					</span>
				);
			})}
		</div>
	);
};

export default Rating;
