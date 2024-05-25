import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button, RatingInput, Textarea } from ".";
import { DevTool } from "@hookform/devtools";
import { useDispatch, useSelector } from "react-redux";
import reviewService from "../services/review.service";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { fetchUserReview } from "../app/reviewsSlice";

const ReviewForm = ({ review, onClose }) => {
	const dispatch = useDispatch();
	const recipeId = useSelector((state) => state.recipes.selectedRecipe._id);
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
		<article className="relative max-w-lg px-5 py-8 my-8 bg-gray-50">
			<div className="flex items-center gap-3">
				<div className="overflow-hidden rounded-full w-14 h-14">
					<img
						src={user.avatar?.url || "/userDefaultDp.jpg"}
						alt="user"
						className="object-cover object-center w-full h-full"
					/>
				</div>
				<p className="font-medium ">{user.name}</p>
			</div>
			<FormProvider {...formMethods}>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col items-start mt-4 gap-y-2"
				>
					<fieldset
						disabled={isSubmitting}
						className="flex flex-col w-full gap-y-2 disabled:opacity-65"
					>
						<RatingInput name="rating" label="Your rating" required />
						<Textarea
							label="Your review"
							className="h-24 min-h-24 max-h-32"
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
						<small className="text-red-700 bg-red-200 py-1.5 px-3">
							<span className="font-semibold">Error: </span>
							{error || "There was some error"}
						</small>
					)}
					<div className="flex justify-between w-full">
						<Button
							type="submit"
							disabled={isSubmitting || !isValid}
							className="px-3 min-w-[100px] h-10 flex justify-center items-center disabled:opacity-65 disabled:cursor-not-allowed"
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
								className="flex items-center justify-center disabled:text-gray-300 disabled:cursor-not-allowed"
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
						className="mt-4 disabled:opacity-70 text-sm disabled:cursor-not-allowed hover:text-brand-primary relative after:absolute after:top-full after:left-0 after:w-full after:bg-brand-primary after:h-[1px]"
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
						className="absolute text-2xl right-4 top-4"
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
