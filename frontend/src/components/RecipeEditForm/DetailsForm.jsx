import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Input, Textarea } from "../";
import { MdDelete } from "react-icons/md";
import { DevTool } from "@hookform/devtools";

const DetailsForm = () => {
	const recipe = useSelector((state) => state.recipes.selectedRecipe);

	const [backendError, setBackendError] = useState("some backend error");
	const [publish, setPublish] = useState(true);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors: frontendError, isValid },
	} = useForm({
		defaultValues: {
			title: recipe.title,
			introduction: recipe.introduction,
			ingredients: recipe.ingredients.map((item) => ({ ingredient: item })),
			steps: recipe.steps.map((item) => ({ step: item })),
			cookingTime: recipe.cookingTime,
		},
	});

	const {
		fields: ingredientFields,
		append: addIngredient,
		remove: removeIngredient,
	} = useFieldArray({
		name: "ingredients",
		control,
	});

	const {
		fields: stepFields,
		append: addStep,
		remove: removeStep,
	} = useFieldArray({
		name: "steps",
		control,
	});

	const onSubmit = async (data) => {
		console.log(data);
	};

	// console.log(recipe);
	// console.log(ingredientFields);
	// console.log(stepFields);
	// console.log(frontendError);

	return (
		<section>
			<h3 className="mb-3 text-lg font-medium">Edit other details</h3>
			<form onSubmit={handleSubmit(onSubmit)} noValidate>
				<fieldset className="flex flex-col gap-4 disabled:opacity-65">
					<Input
						required
						label="Recipe Title"
						className="rounded-md"
						{...register("title", {
							required: "Recipe title is required",
							pattern: {
								value: /^[a-zA-Z0-9\s/-]+$/,
								message:
									"Only (a-z, A-Z, 0-9,-, /) characters are allowed in recipe title",
							},
						})}
					/>
					{frontendError?.title && (
						<small className="font-semibold text-red-500">
							{frontendError.title.message}
						</small>
					)}
					<Textarea
						label="Description"
						className="rounded-md min-h-24"
						{...register("introduction")}
					/>
					<ul className="flex flex-col gap-2">
						{ingredientFields.map((field, index) => {
							return (
								<li key={field.id} className="flex items-center gap-2">
									<Input
										required
										label={index === 0 ? "Ingredients" : null}
										className="rounded-md"
										{...register(`ingredients.${index}.ingredient`, {
											required: "Ingredient cannot be empty",
										})}
									/>
									{index > 0 && (
										<Button
											bgColor="bg-[#f22c3d]"
											title="Delete"
											className="mt-1.5 p-1.5 grid place-content-center rounded hover:bg-[#d61e2e]"
											onClick={() => removeIngredient(index)}
										>
											<MdDelete className="text-base" />
										</Button>
									)}
								</li>
							);
						})}
					</ul>
					{frontendError?.ingredients && (
						<small className="font-semibold text-red-500">
							{
								frontendError.ingredients.find(
									(elem) => elem?.ingredient.message
								).ingredient.message
							}
						</small>
					)}
					<Button
						className="max-w-fit text-sm py-1.5 px-2 rounded-md"
						onClick={() => addIngredient({ ingredient: "" })}
					>
						Add Ingredient
					</Button>

					<ul className="flex flex-col gap-2">
						{stepFields.map((field, index) => {
							return (
								<li key={field.id} className="flex items-start gap-2">
									<Textarea
										label={index === 0 ? "Steps" : null}
										className="overflow-auto rounded-md min-h-fit"
										required
										{...register(`steps.${index}.step`, {
											required: "Steps cannot be empty",
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
						<small className="font-semibold text-red-500">
							{
								frontendError.steps.find((elem) => elem?.step.message).step
									.message
							}
						</small>
					)}
					<Button
						className="max-w-fit text-sm py-1.5 px-2 rounded-md"
						onClick={() => addStep({ step: "" })}
					>
						Add steps
					</Button>
					<Input
						label="Cooking Time"
						required
						type="number"
						placeholder="e.g. 25 (for 25 minutes)"
						{...register("cookingTime", {
							required: "Cooking time is required",
							valueAsNumber: true,
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
						className="rounded-md"
					/>
					{frontendError?.cookingTime && (
						<small className="font-semibold text-red-500">
							{frontendError.cookingTime.message}
						</small>
					)}
					{backendError && !Object.keys(frontendError).length && (
						<small className="p-2 font-semibold text-red-500 bg-red-100 rounded-md">
							<span className="font-bold">Server error: </span>{" "}
							<span>{backendError}</span>
						</small>
					)}
				</fieldset>
				<div className="flex flex-wrap gap-3 mt-5">
					<Button
						type="submit"
						bgColor="bg-[#4CAF50]"
						className="px-3 py-2 rounded-md min-w-fit disabled:opacity-50"
					>
						Save
					</Button>
					<Button
						type="submit"
						bgColor="bg-[#2196F3]"
						className="px-3 py-2 rounded-md min-w-fit disabled:opacity-50"
					>
						Save Draft
					</Button>
				</div>
			</form>
			{/* <DevTool control={control} /> */}
			<small className="inline-block mt-2 text-gray-500">
				<span className="font-semibold text-gray-700">Note: </span> saving draft
				will unpublish the recipe
			</small>
		</section>
	);
};

export default DetailsForm;
