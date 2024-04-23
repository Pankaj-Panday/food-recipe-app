import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
	Container,
	Button,
	AvgRating,
	TimeAgo,
	FormatDate,
} from "../components";
import { SlArrowRight } from "react-icons/sl";
import { FaRegHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleRecipe } from "../app/recipeSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const RecipePage = () => {
	const { recipeId } = useParams();
	const dispatch = useDispatch();
	const recipe = useSelector((state) => state.recipes.selectedRecipe);
	const loading = useSelector((state) => state.recipes.loading);
	const error = useSelector((state) => state.recipes.error);

	useEffect(() => {
		dispatch(fetchSingleRecipe(recipeId));
	}, [dispatch, recipeId]);

	let content = null;

	if (loading) {
		content = (
			<div className="flex flex-col items-center text-center">
				<p className="text-gray-400">Loading recipe...</p>
				<div className="mt-5">
					<AiOutlineLoading3Quarters
						className="animate-spin"
						size="1rem"
						color="#9ca3af"
					/>
				</div>
			</div>
		);
	} else if (error) {
		content = (
			<div className="flex flex-col items-center py-10 text-center">
				<p className="text-2xl text-gray-400">{error}</p>
			</div>
		);
	} else if (recipe) {
		content = (
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
					<h2 className="text-4xl font-bold tracking-tighter">
						{recipe.title}
					</h2>
					<div className="my-4 text-sm">
						{recipe.avgRating && (
							<span className="pr-2 mr-2 border-r-2 border-r-gray-200 ">
								<AvgRating rating={recipe.avgRating} />
							</span>
						)}
						<a
							href="#comments"
							className="word-wide inline-block relative after:absolute after:top-full after:left-0 after:w-full after:bg-brand-primary after:h-[1px]"
						>
							{recipe.totalReviews} reviews
						</a>
					</div>
					{recipe.introduction && <p className="my-4">{recipe.introduction}</p>}
					<Button className="flex mb-7 items-center justify-center gap-1.5 py-2 px-3 rounded-sm hover:bg-[#d64f1f] active:bg-[#d64f1f] min-w-[100px] text-center">
						<span>Save</span>
						<FaRegHeart className="align-middle" />
					</Button>
					{recipe.recipePhoto.url && (
						<div className="mt-7 bg-green-100 w-full min-w-[350px] overflow-hidden sm:w-[90%] md:w-[70%] max-w-[720px] aspect-video">
							<img
								className="object-cover object-center w-full h-full"
								src={recipe.recipePhoto.url}
								alt={`${recipe.title} image`}
							/>
						</div>
					)}

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
						<p className="text-sm">
							<span>Last updated on </span>{" "}
							<FormatDate timestamp={recipe.updatedAt} />
						</p>
					</div>
				</section>
				{/* TODO: Build Comment section */}
				<section id="comments"></section>
			</Container>
		);
	}

	return (
		<article className="h-full max-w-6xl py-10 mx-auto">{content}</article>
	);
};

export default RecipePage;
