import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Button, AvgRating } from "../components";
import { SlArrowRight } from "react-icons/sl";
import { FaRegHeart } from "react-icons/fa6";

const RecipePage = () => {
	const recipe = {
		_id: "662628c524d1f2aec7852b0f",
		title: "Recipe 1",
		introduction: "This is recipe 1",
		cookingTime: 60,
		recipePhoto: {
			url: "https://static.toiimg.com/photo/53251884.cms",
			publicId: null,
		},
		ingredients: ["ingredient 1", "ingredient 2"],
		steps: [
			"In a bowl, mix together yogurt, ginger-garlic paste, turmeric powder, red chili powder, garam masala, cumin powder, coriander powder, salt, and a squeeze of lemon juice. This forms the flavorful marinade for the paneer.",
			"Cut the paneer into cubes of equal size. Pat them dry gently with a paper towel to remove excess moisture. This helps the marinade to stick better to the paneer.",
			"Add the paneer cubes to the marinade mixture. Ensure each piece is coated evenly with the marinade. Let it marinate for at least 30 minutes to allow the flavors to penetrate the paneer.",
			"Thread the marinated paneer cubes onto skewers, alternating with slices of bell peppers, onions, and tomatoes for added flavor and color.",
			"Preheat the grill or oven to medium-high heat. Brush the grill grates or baking tray with oil to prevent sticking. Place the skewers on the grill or baking tray and cook for about 10-15 minutes, turning occasionally, until the paneer is golden brown and slightly charred around the edges.",
		],
		author: {
			_id: "6623a4e5a353fc1a8b65f0c9",
			name: "User 1",
		},
		isPublished: true,
		avgRating: 4.3,
		totalReviews: 47,
		createdAt: "2024-04-22T09:07:17.055Z",
		updatedAt: "2024-04-22T09:07:17.055Z",
	};

	return (
		<article className="max-w-6xl py-10 mx-auto">
			<Container>
				<section className="flex items-center gap-2 mb-10 font-semibold uppercase ">
					<Link
						to="/"
						className="relative after:absolute after:top-full after:left-0 after:w-full after:bg-brand-primary  after:h-[1px]"
					>
						Recipes
					</Link>
					<span>
						<SlArrowRight className="align-middle" size="0.7rem" />
					</span>
					<span>{recipe.title}</span>
				</section>
				<section>
					<h2 className="mb-4 text-4xl font-bold">{recipe.title}</h2>
					<div className="text-sm">
						<span className="pr-2 mr-2 border-r-2 border-r-gray-200 ">
							<AvgRating rating={recipe.avgRating} />
						</span>
						<a
							href="#comments"
							className="word-wide relative after:absolute after:top-full after:left-0 after:w-full after:bg-brand-primary after:h-[1px]"
						>
							{recipe.totalReviews} total reviews
						</a>
					</div>
					<p className="my-4">{recipe.introduction}</p>
					<Button className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-sm mb-5 hover:bg-[#d64f1f] active:bg-[#d64f1f] min-w-[100px] text-center">
						<span>Save</span>
						<FaRegHeart className="align-middle" />
					</Button>
					<div className=" my-6 w-full min-w-[350px] overflow-hidden sm:w-[90%] md:w-[70%] max-w-[720px] aspect-video">
						<img
							className="object-cover object-center w-full h-full"
							src={recipe.recipePhoto.url}
							alt={`${recipe.title} image`}
						/>
					</div>

					<p className="mt-10 box-border relative inline-block p-4 rounded-b-md border border-[#febf05] before:h-[15px] before:w-[calc(100%+2px)] before:absolute before:bottom-full before:-right-[1px] before:bg-[#febf05] before:rounded-t">
						<span className="font-semibold tracking-tight">Cooking Time: </span>{" "}
						{recipe.cookingTime} mins
					</p>

					<div className="my-7">
						<h2 className="mb-3 text-3xl font-bold tracking-tighter">
							Ingredients
						</h2>
						<ul className="list-disc list-inside">
							{recipe.ingredients.map((ingredient, index) => (
								<li key={index} className="mb-0.5">
									{ingredient}
								</li>
							))}
						</ul>
					</div>
					<div className="my-7">
						<h2 className="mb-3 text-3xl font-bold tracking-tighter">
							Instructions
						</h2>
						<ol>
							{recipe.steps.map((step, index) => (
								<li key={index} className="mb-4">
									<p className="mr-1 font-bold tracking-tighter uppercase">
										Step {index + 1}&nbsp;
									</p>
									{step}
								</li>
							))}
						</ol>
					</div>
					<div>
						{/* TODO: Make the author name clickable to allow someone to visit the user profile*/}
						<p className="mb-4 text-sm italic text-gray-600">
							Submitted by{" "}
							<span className="relative after:absolute after:top-full after:left-0 after:w-full after:bg-brand-primary  after:h-[1px]">
								<Link to={`/users/${recipe.author._id}`}>
									{recipe.author.name}
								</Link>
							</span>
						</p>
						{/* TODO: Make the last update to months ago or user friendly date */}
						<p className="text-sm">Last updated on {recipe.updatedAt}</p>
					</div>
				</section>
				{/* TODO: Build Comment section */}
				<section id="comments"></section>
			</Container>
		</article>
	);
};

export default RecipePage;
