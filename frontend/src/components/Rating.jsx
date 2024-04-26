import React from "react";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

const Rating = ({ rating, color = "#febf05", size = "1.25rem" }) => {
	const fullStars = Math.floor(rating);
	const halfStar = Math.round(rating - fullStars);
	return (
		<div className="flex items-center">
			{Array.from({ length: 5 }, (_, index) => {
				return (
					<span key={index}>
						{index < fullStars ? (
							<IoIosStar size={size} color={color} />
						) : halfStar ? (
							<IoIosStarHalf size={size} color={color} />
						) : (
							<IoIosStarOutline key={index} size={size} color={color} />
						)}
					</span>
				);
			})}
		</div>
	);
};

export default Rating;
