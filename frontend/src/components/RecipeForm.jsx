import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Input, Textarea } from "./index.js";
import { MdDelete } from "react-icons/md";
import recipeService from "../services/recipe.service.js";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const RecipeForm = () => {
	const navigate = useNavigate();
	const [backendError, setBackendError] = useState("");
	const [publish, setPublish] = useState(true);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors: frontendError, isSubmitting },
		setFocus,
	} = useForm({
		defaultValues: {
			title: "",
			introduction: "",
			cookingTime: "",
			ingredients: [{ ingredient: "" }], // here
			steps: [{ step: "" }], // and here
		},
	});

	const {
		fields: ingredientFields,
		append: appendIngredient,
		remove: removeIngredient,
	} = useFieldArray({
		name: "ingredients",
		control,
	});

	const {
		fields: stepFields,
		append: appendStep,
		remove: removeStep,
	} = useFieldArray({
		name: "steps",
		control,
	});

	const onSubmit = async (recipeData) => {
		try {
			const {
				title,
				introduction,
				recipePhoto,
				ingredients,
				steps,
				cookingTime,
			} = recipeData;

			const { data } = await recipeService.createRecipe({
				title,
				introduction,
				recipePhoto: recipePhoto[0],
				ingredients: ingredients.map((item) => item.ingredient),
				steps: steps.map((item) => item.step),
				cookingTime,
				isPublished: publish,
			});
			setBackendError("");
			// navigate(`/recipes/${data._id}/view-recipe`);
		} catch (error) {
			setBackendError(
				error.reason.charAt(0).toUpperCase() + error.reason.slice(1)
			);
		}
	};

	let count = 1;
	return (
		<article className="py-6 w-[min(400px,95%)] min-w-[300px] sm:w-4/5 max-w-[660px] mx-auto">
			<div className="bg-gray-50 rounded-lg p-5">
				<h2 className="text-3xl font-bold mb-4">Add a recipe {count++}</h2>
				<form onSubmit={handleSubmit(onSubmit)} noValidate>
					<fieldset
						disabled={isSubmitting}
						className="flex flex-col gap-4 disabled:opacity-65"
					>
						<Input
							label="Recipe Title"
							placeholder="e.g. Paneer tikka masala"
							className="rounded-md"
							required
							{...register("title", {
								required: "Recipe title is required",
								pattern: {
									value: /^[a-zA-Z0-9\s/-]+$/,
									message:
										"Only (a-z, A-Z, 0-9,-, /) characters are allowed in recipeTitle",
								},
							})}
						/>
						{frontendError?.title && (
							<small className="text-red-500 font-semibold">
								{frontendError.title.message}
							</small>
						)}
						<Textarea
							label="Description"
							className="min-h-24 rounded-md"
							placeholder="Share something special about your recipe"
							{...register("introduction")}
						/>
						<Input
							label="Photo"
							type="file"
							className="rounded-md"
							accept="image/png, image/jpeg"
							{...register("recipePhoto")}
						/>
						<ul className="flex flex-col gap-2">
							{ingredientFields.map((field, index) => {
								const label = index === 0 ? "Ingredients" : null;
								return (
									<li key={field.id} className="flex gap-2 items-center">
										<Input
											label={label}
											placeholder="e.g. 250g paneer"
											required
											className="rounded-md"
											{...register(`ingredients.${index}.ingredient`, {
												required: "Ingredient cannot be empty",
											})}
										/>
										{index > 0 && (
											<Button
												className="mt-1.5 p-1.5 grid place-content-center rounded hover:bg-[#d61e2e]"
												bgColor="bg-[#f22c3d]"
												onClick={() => removeIngredient(index)}
												title="Delete"
											>
												<MdDelete className="text-base" />
											</Button>
										)}
									</li>
								);
							})}
						</ul>
						{frontendError?.ingredients && (
							<small className="text-red-500 font-semibold">
								{
									frontendError.ingredients.find(
										(err) => err?.ingredient.message
									).ingredient.message
								}
							</small>
						)}
						<Button
							className="w-[130px] text-sm py-1.5 px-2 rounded-lg"
							onClick={() => appendIngredient({ ingredient: "" })}
						>
							Add Ingredient
						</Button>
						<ul className="flex flex-col gap-2">
							{stepFields.map((field, index) => {
								const label = index === 0 ? "Steps" : null;
								return (
									<li key={field.id} className="flex gap-2 items-start">
										<Textarea
											label={label}
											className="min-h-12 h-12 rounded-md"
											placeholder="e.g. Boil mixture for 10 minutes"
											required
											{...register(`steps.${index}.step`, {
												required: "Step cannot be empty",
											})}
										/>
										{index > 0 && (
											<Button
												className="mt-1.5 p-1.5 grid place-content-center rounded hover:bg-[#d61e2e]"
												bgColor="bg-[#f22c3d]"
												title="Delete"
												onClick={() => removeStep(index)}
											>
												<MdDelete />
											</Button>
										)}
									</li>
								);
							})}
						</ul>
						{frontendError?.steps && (
							<small className="text-red-500 font-semibold">
								{
									frontendError.steps.find((err) => err?.step.message).step
										.message
								}
							</small>
						)}
						<Button
							className="w-[90px] text-sm py-1.5 px-2 rounded-lg"
							onClick={() => appendStep({ step: "" })}
						>
							Add Step
						</Button>
						<Input
							type="number"
							label="Cooking Time (in mins)"
							placeholder="e.g. 25 (for 25 minutes)"
							required
							className="rounded-md"
							{...register("cookingTime", {
								required: "Cooking time is required",
								valueAsNumber: true, // it runs before validation and returns NaN if value != number
								min: {
									value: 0,
									message: "Cooking time cannot be less than 0",
								},
								validate: {
									checkNumber: (value) =>
										!isNaN(value) ||
										"Enter valid cooking time in minutes (e.g. 25)",
								},
							})}
						/>
						{frontendError?.cookingTime && (
							<small className="text-red-500 font-semibold">
								{frontendError.cookingTime.message}
							</small>
						)}
						{backendError && !Object.keys(frontendError).length && (
							<small className="text-red-500 font-semibold p-2 bg-red-100 rounded-md">
								<span className="font-bold">Server error: </span>{" "}
								<span>{backendError}</span>
							</small>
						)}
					</fieldset>
					<div className="flex flex-wrap gap-3 mt-5">
						<Button
							type="submit"
							bgColor="bg-[#4CAF50]"
							className="w-[7rem] min-w-[6.5rem] p-2 rounded-xl disabled:opacity-50 flex justify-center items-center"
							disabled={isSubmitting}
							onClick={() => setPublish(true)}
						>
							{isSubmitting && publish ? (
								<AiOutlineLoading3Quarters className="animate-spin align-middle" />
							) : (
								<span>Publish</span>
							)}
						</Button>
						<Button
							type="submit"
							bgColor="bg-[#2196F3]"
							className="w-[7rem] min-w-[6.5rem] p-2 rounded-xl disabled:opacity-50 flex justify-center items-center"
							disabled={isSubmitting}
							onClick={() => setPublish(false)}
						>
							{isSubmitting && !publish ? (
								<AiOutlineLoading3Quarters className="animate-spin align-middle" />
							) : (
								<span>Save Draft</span>
							)}
						</Button>
						<Button
							type="button"
							bgColor="bg-[#E0E0E0]"
							textColor="text-[#333333]"
							className="w-[7rem] min-w-[6.5rem] p-2 rounded-xl disabled:opacity-50"
							disabled={isSubmitting}
						>
							Cancel
						</Button>
					</div>
				</form>
			</div>
		</article>
	);
};

export default RecipeForm;
