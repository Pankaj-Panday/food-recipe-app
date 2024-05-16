import React from "react";
import { Button, Rating } from "../components/";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
	const navigate = useNavigate();
	// const recipe = {
	// 	_id: "662628c524d1f2aec7852b0f",
	// 	title: "Recipe 1",
	// 	introduction: "This is recipe 1",
	// 	cookingTime: 60,
	// 	recipePhoto: {
	// 		url: "https://images.getrecipekit.com/20211108205409-paneer-bhuna-masala.jpg?aspect_ratio=16:9&quality=90&auto_optimize=medium",
	// 		publicId: null,
	// 	},
	// 	ingredients: ["ingredient 1", "ingredient 2"],
	// 	steps: [
	// 		"In a bowl, mix together yogurt, ginger-garlic paste, turmeric powder, red chili powder, garam masala, cumin powder, coriander powder, salt, and a squeeze of lemon juice. This forms the flavorful marinade for the paneer.",
	// 		"Cut the paneer into cubes of equal size. Pat them dry gently with a paper towel to remove excess moisture. This helps the marinade to stick better to the paneer.",
	// 		"Add the paneer cubes to the marinade mixture. Ensure each piece is coated evenly with the marinade. Let it marinate for at least 30 minutes to allow the flavors to penetrate the paneer.",
	// 		"Thread the marinated paneer cubes onto skewers, alternating with slices of bell peppers, onions, and tomatoes for added flavor and color.",
	// 		"Preheat the grill or oven to medium-high heat. Brush the grill grates or baking tray with oil to prevent sticking. Place the skewers on the grill or baking tray and cook for about 10-15 minutes, turning occasionally, until the paneer is golden brown and slightly charred around the edges.",
	// 	],
	// 	author: {
	// 		_id: "6623a4e5a353fc1a8b65f0c9",
	// 		name: "User 1",
	// 	},
	// 	isPublished: true,
	// 	avgRating: 4,
	// 	totalReviews: 2,
	// 	createdAt: "2024-04-22T09:07:17.055Z",
	// 	updatedAt: "2024-04-25T18:53:30.999Z",
	// };
	return (
		<div
			className="relative w-full transition-all duration-150 border rounded-md shadow-lg cursor-pointer hover:shadow-2xl hover:scale-[1.01] h-full"
			onClick={() => navigate(`/view-recipe/${recipe._id}`)}
		>
			{" "}
			<div className="overflow-hidden bg-[linear-gradient(352deg,rgba(2,0,36,1)0%,rgba(8,8,40,1)39%,rgba(131,131,131,1)100%)] rounded-t-md aspect-video flex justify-center items-center min-w-[278px]">
				{recipe?.recipePhoto.url ? (
					<img
						className="object-cover w-full h-full"
						src={recipe?.recipePhoto.url}
						alt={recipe?.title}
					/>
				) : (
					<p className="text-xs text-white">Photo not available</p>
				)}
			</div>
			<div className="p-3 min-h-36">
				<h3 className="text-2xl font-bold tracking-tighter">{recipe?.title}</h3>
				<div className="flex justify-between my-3">
					{recipe.totalReviews > 0 && (
						<span>
							<Rating rating={recipe?.avgRating} />
						</span>
					)}
					<span>{recipe.totalReviews} reviews</span>
				</div>
				<p className="text-sm">{recipe.cookingTime} mins</p>
			</div>
			<Button className="absolute grid p-2 text-xl rounded-full top-2 right-2 place-content-center hover:bg-[#ee470d] active:bg-[#ee470d]">
				<IoMdHeart />
			</Button>
		</div>
	);
};

export default RecipeCard;
