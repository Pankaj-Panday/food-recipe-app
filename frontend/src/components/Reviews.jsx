import React, { useEffect } from "react";
import { Button, Rating, TimeAgo } from "./index.js";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchReviews,
  fetchUserReview,
  resetState,
  showAllReviews,
  showFilteredReviews,
} from "../app/reviewsSlice.js";

const Reviews = () => {
  const dispatch = useDispatch();

  const recipeId = useSelector(
    (state) => state.recipes.selectedRecipe.data._id,
  );
  const loading = useSelector((state) => state.reviews.loading);
  const loggedInUserReviewLoading = useSelector(
    (state) => state.reviews.selectedReviewLoading,
  );
  const loggedInUserReviewError = useSelector(
    (state) => state.reviews.selectedReviewError,
  );
  const loggedInUserReview = useSelector(
    (state) => state.reviews.selectedReview,
  );
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const loggedInUser = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.reviews.error);
  const currentPage = useSelector((state) => state.reviews.currentPage);
  const totalPages = useSelector((state) => state.reviews.totalPages);
  const displayedReviews = useSelector(
    (state) => state.reviews.displayedReviews,
  );

  const hasMoreReviews = currentPage < totalPages;

  useEffect(() => {
    let promise1, promise2;
    if (isLoggedIn) {
      promise1 = dispatch(
        fetchUserReview({ userId: loggedInUser._id, recipeId: recipeId }),
      );
    }
    promise2 = dispatch(fetchReviews({ recipeId: recipeId, pageNum: 1 }));
    promise2
      .unwrap()
      .then((data) => {
        isLoggedIn
          ? dispatch(
              showFilteredReviews({
                allReviews: data.reviews,
                loggedInUser: loggedInUser,
              }),
            )
          : dispatch(showAllReviews(data.reviews));
      })
      .catch((err) => {}); // no need to do anything, its just catching the aborted promise error or maybe unwrap promise error when promise was not settled

    return () => {
      if (isLoggedIn) {
        promise1.abort();
      }
      promise2.abort();
      dispatch(resetState());
    };
  }, [
    dispatch,
    fetchUserReview,
    fetchReviews,
    resetState,
    recipeId,
    isLoggedIn,
    loggedInUser,
  ]);

  const handleLoadReviews = async () => {
    if (hasMoreReviews) {
      const data = await dispatch(
        fetchReviews({ recipeId: recipeId, pageNum: currentPage + 1 }),
      ).unwrap();
      if (isLoggedIn) {
        dispatch(
          showFilteredReviews({
            allReviews: data.reviews,
            loggedInUser: loggedInUser,
          }),
        );
      } else dispatch(showAllReviews(data.reviews));
    }
  };

  let content = null;

  if (
    (loading || loggedInUserReviewLoading) &&
    displayedReviews?.length === 0
  ) {
    content = <p className="mt-3 text-sm text-gray-400">Loading reviews...</p>;
  } else if (
    error ||
    (loggedInUserReviewError && loggedInUserReviewError !== "Review not found")
  ) {
    content = (
      <p className="mt-3 text-sm text-gray-400">
        Error loading reviews: {error}
      </p>
    );
  } else {
    content = (
      <>
        <ul className="flex flex-col gap-y-5">
          {isLoggedIn && <Review review={loggedInUserReview} />}
          {displayedReviews.map((review) => (
            <Review key={review?._id} review={review} />
          ))}
        </ul>
        {hasMoreReviews && (
          <Button
            bgColor="bg-transparent"
            textColor="text-black"
            className="relative mt-8 text-sm before:absolute before:top-full before:h-[1px] before:w-full before:bg-brand-primary"
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
  if (!review) return null;
  return (
    <li className="max-w-2xl border-y border-gray-300 py-5 text-sm">
      <header className="mb-3 flex items-center gap-2">
        <div className="h-8 w-8 overflow-hidden rounded-full">
          <img
            className="h-full w-full object-cover object-center"
            src={review?.owner?.avatar || "/userDefaultDp.jpg"}
          />
        </div>
        <p className="relative font-medium capitalize after:absolute after:left-0 after:top-full after:h-[1px] after:w-full after:bg-brand-primary">
          <Link to={`/users/profile/${review?.owner._id}`}>
            {review?.owner.name}
          </Link>
        </p>
      </header>
      <div className="mb-2 flex gap-5">
        <Rating size="1rem" rating={review?.rating} />
        <p className="text-xs italic text-gray-400">
          updated <TimeAgo timestamp={review?.updatedAt} />
        </p>
      </div>
      <p className="break-words text-sm">{review?.comment}</p>
    </li>
  );
};

export default Reviews;
