import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Button, RatingInput, Textarea } from ".";
import { DevTool } from "@hookform/devtools";
import { useDispatch, useSelector } from "react-redux";
import reviewService from "../services/review.service";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { addSingleReview } from "../app/reviewsSlice";

const ReviewForm = () => {
	const dispatch = useDispatch();
	const recipeId = useSelector((state) => state.recipes.selectedRecipe._id);
	const user = useSelector((state) => state.auth.user);
	const [backendError, setBackendError] = useState("");

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
	} = formMethods;

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset();
		}
	}, [isSubmitSuccessful, reset]);

	const onSubmit = async (data) => {
		const { rating, comment } = data;
		try {
			const res = await reviewService.createReview(recipeId, {
				rating,
				comment,
			});
			if (res?.success) {
				const addedReview = {
					...res.data,
					owner: {
						_id: user._id,
						name: user.name,
						avatar: user.avatar.url || null,
					},
				};
				dispatch(addSingleReview(addedReview));
			}
		} catch (error) {
			setBackendError(error.reason);
		}
	};

	const error =
		frontendError.rating?.message ||
		frontendError.comment?.message ||
		backendError;

	return (
		<article className="max-w-lg px-5 py-8 my-8 bg-gray-50">
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
							{error || "this is error"}
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
							) : (
								<span>Submit</span>
							)}
						</Button>
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
					</div>
				</form>
			</FormProvider>
			<DevTool control={control} />
		</article>
	);
};

export default ReviewForm;
