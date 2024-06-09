import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button, RatingInput, Textarea } from ".";
import { DevTool } from "@hookform/devtools";
import { useDispatch, useSelector } from "react-redux";
import reviewService from "../services/review.service";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { fetchUserReview } from "../app/reviewsSlice";
import { useNavigate } from "react-router-dom";

const ReviewForm = ({ review, onClose }) => {
  const dispatch = useDispatch();
  const recipeId = useSelector(
    (state) => state.recipes.selectedRecipe.data._id,
  );
  const user = useSelector((state) => state.auth.user);

  const [backendError, setBackendError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const formMethods = useForm({
    defaultValues: {
      rating: "",
      comment: "",
    },
  });

  const {
    register,
    formState: {
      errors: frontendError,
      isSubmitting,
      isSubmitSuccessful,
      isValid,
      isDirty,
    },
    reset,
    control,
    handleSubmit,
    setValue,
  } = formMethods;

  const navigate = useNavigate();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    if (review) {
      setValue("rating", review.rating.toString()); // wasn't working as expected without converting to string also passing it as default value wasn't working in this case for radio button
      setValue("comment", review.comment);
    }
  }, [isSubmitSuccessful, reset, review, setValue]);

  const onSubmit = async (data) => {
    const { rating, comment } = data;
    try {
      let res;
      if (!review) {
        res = await reviewService.createReview(recipeId, {
          rating,
          comment,
        });
      } else {
        res = await reviewService.updateReview(review._id, { rating, comment });
        onClose();
      }
      if (res?.success) {
        // show some success message to user maybe
        dispatch(fetchUserReview({ userId: user._id, recipeId: recipeId }));
      }
    } catch (error) {
      setBackendError(error.reason);
    }
  };

  const onDelete = async () => {
    setIsDeleting(true);
    const res = await reviewService.deleteReview(review._id);
    if (res?.success) {
      dispatch(fetchUserReview({ userId: user._id, recipeId: recipeId }));
      onClose();
    }
    setIsDeleting(false);
  };

  const error =
    frontendError.rating?.message ||
    frontendError.comment?.message ||
    backendError;

  return (
    <article className="relative my-8 max-w-lg bg-gray-50 px-5 py-8">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 overflow-hidden rounded-full">
          <img
            src={user.avatar?.url || "/userDefaultDp.jpg"}
            alt="user"
            className="h-full w-full object-cover object-center"
          />
        </div>
        <p className="font-medium">{user.name}</p>
      </div>
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 flex flex-col items-start gap-y-2"
        >
          <fieldset
            disabled={isSubmitting}
            className="flex w-full flex-col gap-y-2 disabled:opacity-65"
          >
            <RatingInput name="rating" label="Your rating" required />
            <Textarea
              label="Your review"
              className="h-24 max-h-32 min-h-24"
              placeholder="Only 250 characters allowed"
              {...register("comment", {
                maxLength: {
                  value: 250,
                  message: "Only 250 characters allowed",
                },
              })}
            />
          </fieldset>
          {error && (
            <small className="bg-red-200 px-3 py-1.5 text-red-700">
              <span className="font-semibold">Error: </span>
              {error || "There was some error"}
            </small>
          )}
          <div className="flex w-full justify-between">
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="flex h-10 min-w-[100px] items-center justify-center px-3 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isSubmitting ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : review ? (
                <span>Update</span>
              ) : (
                <span>Submit</span>
              )}
            </Button>
            {!review && (
              <Button
                type="button"
                disabled={!isDirty}
                className="flex items-center justify-center disabled:cursor-not-allowed disabled:text-gray-300"
                bgColor="bg-transparent"
                textColor="text-brand-primary"
                onClick={() => {
                  reset();
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
      {review && (
        <>
          <Button
            bgColor="bg-transparent"
            textColor="text-gray-700"
            disabled={isDeleting}
            className="relative mt-4 text-sm after:absolute after:left-0 after:top-full after:h-[1px] after:w-full after:bg-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-70"
            onClick={onDelete}
          >
            {!isDeleting ? (
              <span>Delete my review</span>
            ) : (
              <span>Deleting...</span>
            )}
          </Button>
          <Button
            bgColor="bg-transparent"
            textColor="text-gray-400"
            className="absolute right-4 top-4 text-2xl"
            onClick={onClose}
          >
            <span className="sr-only" tabIndex={0}>
              Close form
            </span>
            <IoCloseSharp />
          </Button>
        </>
      )}
      <DevTool control={control} />
    </article>
  );
};

export default ReviewForm;
