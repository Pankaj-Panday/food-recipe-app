import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
	Container,
	Button,
	Rating,
	FormatDate,
	Reviews,
	ReviewForm,
	ProtectedRoute,
} from "../components";
import { SlArrowRight } from "react-icons/sl";
import { FaRegHeart } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSingleRecipe } from "../app/recipesSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { fetchUserReview } from "../app/reviewsSlice";
import { CiWarning } from "react-icons/ci";
import recipeService from "../services/recipe.service";

const RecipePage = () => {
	const { recipeId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
	const loggedInUser = useSelector((state) => state.auth.user);
	const recipe = useSelector((state) => state.recipes.selectedRecipe);
	const loading = useSelector((state) => state.recipes.loading);
	const error = useSelector((state) => state.recipes.error);
	const loggedInUserReview = useSelector(
		(state) => state.reviews.selectedReview
	);
	const loggedInUserReviewLoading = useSelector(
		(state) => state.reviews.selectedReviewLoading
	);
	const loggedInUserReviewError = useSelector(
		(state) => state.reviews.selectedReviewError
	);

	const [reviewUpdate, setReviewUpdate] = useState(false);
	const [showDeletePopup, setShowDeletePopup] = useState(false);

	useEffect(() => {
		dispatch(fetchSingleRecipe(recipeId));
		if (isLoggedIn) {
			dispatch(
				fetchUserReview({ userId: loggedInUser?._id, recipeId: recipeId })
			);
		}
	}, [dispatch, fetchUserReview, loggedInUser, isLoggedIn, recipeId]);

	let recipeContent, reviewFormContent;
	const userIsRecipeOwner = recipe?.author._id === loggedInUser?._id;

	if (isLoggedIn && !userIsRecipeOwner) {
		if (loggedInUserReviewLoading) {
			reviewFormContent = (
				<article className="max-w-lg px-5 py-8 my-8 bg-gray-50">
					<p className="text-gray-500">Loading...</p>
				</article>
			);
		} else if (loggedInUserReviewError === "Review not found") {
			reviewFormContent = <ReviewForm />;
		} else if (loggedInUserReview && !reviewUpdate) {
			reviewFormContent = (
				<article className="max-w-lg px-5 py-8 my-8 bg-gray-50">
					<p className="text-gray-500">You already reviewed this recipe!</p>
					<Button
						className="px-3 py-2 mt-3 min-w-fit"
						onClick={() => {
							setReviewUpdate(true);
						}}
					>
						Update My Review
					</Button>
				</article>
			);
			// show him the loggedInUserReview with "update review button",
			// if he clicks on update, show <ReviewForm /> with already filled
			// review details and give him options to "update" & "delete" review
			// don't show the clear option
		} else if (loggedInUserReview && reviewUpdate) {
			reviewFormContent = (
				<ReviewForm
					review={loggedInUserReview}
					onClose={() => {
						setReviewUpdate(false);
					}}
				/>
			);
		}
	} else {
		reviewFormContent = null;
	}

	if (loading) {
		recipeContent = (
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
		recipeContent = (
			<div className="flex flex-col items-center py-10 text-center">
				<p className="text-2xl text-gray-400">{error}</p>
			</div>
		);
	} else if (recipe) {
		recipeContent = (
			<Container>
				<section className="flex items-center gap-2 mb-10 font-semibold uppercase ">
					<Link
						to="/recipes"
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
					{userIsRecipeOwner &&
						(recipe.isPublished ? (
							<small className="inline-block mt-2 italic text-green-500">
								<span className="font-semibold">Published</span>, recipe is
								visible to all.
							</small>
						) : (
							<small className="inline-block mt-2 italic text-red-500">
								<span className="font-semibold">Not published</span>, recipe is
								visible to you only.
							</small>
						))}
					<div className="flex items-center my-4 text-sm">
						{recipe.avgRating && (
							<span className="flex items-center pr-2 mr-2 border-r-2 border-r-gray-200">
								<Rating rating={recipe.avgRating} />
								&nbsp;
								<span className="text-xs font-semibold">
									({recipe.avgRating})
								</span>
							</span>
						)}
						<a
							href="#comments"
							className="word-wide inline-block relative after:absolute after:top-full after:left-0 after:w-full after:bg-brand-primary after:h-[1px]"
						>
							{recipe.totalReviews} reviews
						</a>
					</div>
					{recipe?.introduction && (
						<p className="my-4">{recipe.introduction}</p>
					)}
					{isLoggedIn && (
						<>
							<div className="flex flex-wrap gap-3">
								<Button className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-sm hover:bg-[#d64f1f] active:bg-[#d64f1f] min-w-[100px] text-center">
									<span>Save</span>
									<FaRegHeart className="align-middle" />
								</Button>
								{/* Edit button - will be shown to the owner of the recipe only */}
								{userIsRecipeOwner && (
									<Button
										className="py-2 px-3 rounded-sm hover:bg-brand-primary-dark active:bg-brand-primary-dark min-w-[100px] text-center"
										onClick={() => navigate(`/edit-recipe/${recipeId}`)}
									>
										Edit
									</Button>
								)}
							</div>
							{userIsRecipeOwner && (
								<>
									<Button
										bgColor="bg-transparent"
										textColor="text-brand-primary"
										className="mt-3 text-sm hover:text-brand-primary-dark"
										onClick={() => setShowDeletePopup(true)}
									>
										Delete recipe
									</Button>
									{showDeletePopup && (
										<DeletePopup
											onClose={() => {
												setShowDeletePopup(false);
											}}
											recipeId={recipe._id}
										/>
									)}
								</>
							)}
						</>
					)}

					<div className="mt-4 bg-[linear-gradient(352deg,rgba(2,0,36,1)0%,rgba(8,8,40,1)39%,rgba(131,131,131,1)100%)] w-full overflow-hidden sm:w-[90%] md:w-[70%] max-w-[720px] aspect-video flex justify-center items-center">
						{recipe.recipePhoto.url ? (
							<img
								className="object-cover object-center w-full h-full"
								src={recipe.recipePhoto.url}
								alt={`${recipe.title} image`}
							/>
						) : (
							<p className="text-sm text-white">Photo not available</p>
						)}
					</div>

					<p className="mt-10 box-border relative inline-block p-4 rounded-b-md border border-[#febf05] before:h-[15px] before:w-[calc(100%+2px)] before:absolute before:bottom-full before:-right-[1px] before:bg-[#febf05] before:rounded-t">
						<span className="font-semibold tracking-tight">Cooking Time: </span>{" "}
						{recipe.cookingTime} mins
					</p>

					<div className="my-7">
						<h3 className="mb-3 text-3xl font-bold tracking-tighter">
							Ingredients
						</h3>
						<ul className="list-disc list-inside">
							{recipe.ingredients.map((ingredient, index) => (
								<li key={index} className="mb-0.5">
									{ingredient}
								</li>
							))}
						</ul>
					</div>
					<div className="my-7">
						<h3 className="mb-3 text-3xl font-bold tracking-tighter">
							Instructions
						</h3>
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
								<Link to={`/users/profile/${recipe.author._id}`}>
									{recipe.author.name}
								</Link>
							</span>
						</p>
						{/* TODO: Make the last update to months ago or user friendly date */}
						<p className="text-sm">
							<span>Created on </span>{" "}
							<FormatDate timestamp={recipe.createdAt} />
						</p>
					</div>
				</section>

				<section id="comments" className="my-7">
					<h3 className="mb-3 text-3xl font-bold tracking-tighter">Reviews</h3>
					{reviewFormContent}
					<Reviews />
				</section>
			</Container>
		);
	}

	return (
		<article className="h-full max-w-6xl py-10 mx-auto">
			{recipeContent}
		</article>
	);
};

const DeletePopup = ({ onClose, recipeId }) => {
	const navigate = useNavigate();
	const [error, setError] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		document.querySelector("body").style.overflow = "hidden";
		return () => {
			document.querySelector("body").style.overflow = "unset";
		};
	}, []);

	const handleClick = async () => {
		try {
			setIsDeleting(true);
			const res = await recipeService.deleteRecipe(recipeId);
			if (res?.success) {
				setError(null); // no need since we are navigating to other page
				navigate("/recipes");
			}
		} catch (error) {
			setError(error.reason);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<article className="items-center overlay">
			<section className="flex flex-col items-center gap-3 p-5 bg-white rounded-md sm:gap-4 drop-shadow-xl min-w-[270px] text-center justify-center">
				{isDeleting ? (
					<>
						<AiOutlineLoading3Quarters className="text-3xl text-gray-200 align-middle animate-spin" />
						<p>Deleting...</p>
					</>
				) : (
					<>
						<div className="text-5xl text-yellow-500 md:text-9xl">
							<CiWarning />
						</div>
						<h2 className="text-xl font-bold sm:text-3xl">
							Proceed with deletion?
						</h2>
						<small className="font-medium">(This is irreversible)</small>
						{error && (
							<small className="font-bold text-red-400 text-wrap">
								{error} <span>. Would you like to try again?</span>
							</small>
						)}
						<div className="flex gap-3">
							<Button
								bgColor="bg-[#f22c3d]"
								className="px-3 py-1.5 rounded-md hover:bg-[#fc0016] active:bg-[#fc0016] min-w-[60px]"
								onClick={handleClick}
							>
								Yes
							</Button>
							<Button
								bgColor="bg-gray-700"
								className="px-3 py-1.5 rounded-md hover:bg-[#172f55] active:bg-[#172f55] min-w-[60px]"
								onClick={onClose}
							>
								No
							</Button>
						</div>
					</>
				)}
			</section>
		</article>
	);
};

export default RecipePage;
