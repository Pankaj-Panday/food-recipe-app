import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Container,
  Button,
  Rating,
  FormatDate,
  Reviews,
  ReviewForm,
  SaveRecipeButton,
} from "../components";
import { SlArrowRight } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkRecipeIsSaved, fetchSingleRecipe } from "../app/recipesSlice";
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
  const { data: recipe, isSaved } = useSelector(
    (state) => state.recipes.selectedRecipe,
  );
  const loading = useSelector((state) => state.recipes.loading);
  const error = useSelector((state) => state.recipes.error);
  const loggedInUserReview = useSelector(
    (state) => state.reviews.selectedReview,
  );
  const loggedInUserReviewLoading = useSelector(
    (state) => state.reviews.selectedReviewLoading,
  );
  const loggedInUserReviewError = useSelector(
    (state) => state.reviews.selectedReviewError,
  );

  const [reviewUpdate, setReviewUpdate] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    dispatch(fetchSingleRecipe(recipeId));
    if (isLoggedIn) {
      dispatch(checkRecipeIsSaved(recipeId));
      dispatch(
        fetchUserReview({ userId: loggedInUser?._id, recipeId: recipeId }),
      );
    }
  }, [dispatch, fetchUserReview, loggedInUser, isLoggedIn, recipeId]);

  let recipeContent, reviewFormContent;
  const userIsRecipeOwner = recipe?.author._id === loggedInUser?._id;

  if (isLoggedIn && !userIsRecipeOwner) {
    if (loggedInUserReviewLoading) {
      reviewFormContent = (
        <article className="my-8 max-w-lg bg-gray-50 px-5 py-8">
          <p className="text-gray-500">Loading...</p>
        </article>
      );
    } else if (loggedInUserReviewError === "Review not found") {
      reviewFormContent = <ReviewForm />;
    } else if (loggedInUserReview && !reviewUpdate) {
      reviewFormContent = (
        <article className="my-8 max-w-lg bg-gray-50 px-5 py-8">
          <p className="text-gray-500">You already reviewed this recipe!</p>
          <Button
            className="mt-3 min-w-fit px-3 py-2"
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
        <section className="mb-10 flex items-center gap-2 font-semibold uppercase">
          <Link
            to="/recipes"
            className="relative after:absolute after:left-0 after:top-full after:h-[1px] after:w-full after:bg-brand-primary"
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
              <small className="mt-2 inline-block italic text-green-500">
                <span className="font-semibold">Published</span>, recipe is
                visible to all.
              </small>
            ) : (
              <small className="mt-2 inline-block italic text-red-500">
                <span className="font-semibold">Not published</span>, recipe is
                visible to you only.
              </small>
            ))}
          <div className="my-4 flex items-center text-sm">
            {recipe.avgRating && (
              <span className="mr-2 flex items-center border-r-2 border-r-gray-200 pr-2">
                <Rating rating={recipe.avgRating} />
                &nbsp;
                <span className="text-xs font-semibold">
                  ({recipe.avgRating})
                </span>
              </span>
            )}
            <a
              href="#comments"
              className="word-wide relative inline-block after:absolute after:left-0 after:top-full after:h-[1px] after:w-full after:bg-brand-primary"
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
                <SaveRecipeButton recipeId={recipeId} isSaved={isSaved} />
                {/* Edit button - will be shown to the owner of the recipe only */}
                {userIsRecipeOwner && (
                  <Button
                    className="min-w-[100px] rounded-sm px-3 py-2 text-center hover:bg-brand-primary-dark active:bg-brand-primary-dark"
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

          <div className="mt-4 flex aspect-video w-full max-w-[720px] items-center justify-center overflow-hidden bg-[linear-gradient(352deg,rgba(2,0,36,1)0%,rgba(8,8,40,1)39%,rgba(131,131,131,1)100%)] sm:w-[90%] md:w-[70%]">
            {recipe.recipePhoto.url ? (
              <img
                className="h-full w-full object-cover object-center"
                src={recipe.recipePhoto.url}
                alt={`${recipe.title} image`}
              />
            ) : (
              <p className="text-sm text-white">Photo not available</p>
            )}
          </div>

          <p className="relative mt-10 box-border inline-block rounded-b-md border border-[#febf05] p-4 before:absolute before:-right-[1px] before:bottom-full before:h-[15px] before:w-[calc(100%+2px)] before:rounded-t before:bg-[#febf05]">
            <span className="font-semibold tracking-tight">Cooking Time: </span>{" "}
            {recipe.cookingTime} mins
          </p>

          <div className="my-7">
            <h3 className="mb-3 text-3xl font-bold tracking-tighter">
              Ingredients
            </h3>
            <ul className="list-inside list-disc">
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
                  <p className="mr-1 font-bold uppercase tracking-tighter">
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
              <span className="relative after:absolute after:left-0 after:top-full after:h-[1px] after:w-full after:bg-brand-primary">
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
    <article className="mx-auto h-full max-w-6xl py-10">
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
    <article className="overlay items-center">
      <section className="flex min-w-[270px] flex-col items-center justify-center gap-3 rounded-md bg-white p-5 text-center drop-shadow-xl sm:gap-4">
        {isDeleting ? (
          <>
            <AiOutlineLoading3Quarters className="animate-spin align-middle text-3xl text-gray-200" />
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
              <small className="text-wrap font-bold text-red-400">
                {error} <span>. Would you like to try again?</span>
              </small>
            )}
            <div className="flex gap-3">
              <Button
                bgColor="bg-[#f22c3d]"
                className="min-w-[60px] rounded-md px-3 py-1.5 hover:bg-[#fc0016] active:bg-[#fc0016]"
                onClick={handleClick}
              >
                Yes
              </Button>
              <Button
                bgColor="bg-gray-700"
                className="min-w-[60px] rounded-md px-3 py-1.5 hover:bg-[#172f55] active:bg-[#172f55]"
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
