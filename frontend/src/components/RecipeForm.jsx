import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Container, Input, Textarea } from "./index.js";

const RecipeForm = () => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors: frontEndError },
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

	// console.log("Ingredients array", ingredientFields);
	// console.log(stepFields);
	// console.log(frontEndError);

	const onSubmit = (data) => {
		console.log(data);
	};

	const onError = (error, e) => {
		console.log(error);
		if (error.ingredients) {
			const ingredientInput = error.ingredients.find((ingredient) => {
				if (ingredient) {
					return ingredient.ref;
				}
				return false;
			});

			ingredientInput.focus();
		}
	};

	return (
		<article className="py-6 w-[min(400px,95%)] min-w-[300px] sm:w-4/5 max-w-[660px] mx-auto">
			<div className="bg-gray-50 rounded-lg p-5">
				<h2 className="text-3xl font-bold mb-4">Add a recipe</h2>
				<form
					onSubmit={handleSubmit(onSubmit, onError)}
					className="flex flex-col gap-4"
					noValidate
				>
					<Input
						label="Recipe Title"
						placeholder="e.g. Paneer tikka masala"
						className=""
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
					<Textarea
						label="Description"
						placeholder="Share something special about your recipe"
						{...register("introduction")}
					/>
					<Input
						label="Photo"
						type="file"
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
										{...register(`ingredients.${index}.ingredient`, {
											required: "Ingredient cannot be empty",
										})}
									/>
									{index > 0 && (
										<Button
											type="button"
											onClick={() => removeIngredient(index)}
										>
											Remove
										</Button>
									)}
								</li>
							);
						})}
					</ul>
					<Button
						className="w-12 py-1.5 px-2 rounded-lg"
						onClick={() => appendIngredient({ ingredient: "" })}
					>
						Add
					</Button>
					<ul className="flex flex-col gap-2">
						{stepFields.map((field, index) => {
							const label = index === 0 ? "Steps" : null;
							return (
								<li key={field.id} className="flex gap-2 items-center">
									<Input
										label={label}
										required
										{...register(`steps.${index}.step`, {
											required: "Step cannot be empty",
										})}
									/>
									{index > 0 && (
										<Button onClick={() => removeStep(index)}>Remove</Button>
									)}
								</li>
							);
						})}
					</ul>
					<Button
						className="w-12 py-1.5 px-2 rounded-lg"
						onClick={() => appendStep({ step: "" })}
					>
						Add
					</Button>
					<Input
						type="number"
						label="Cooking Time (in mins)"
						placeholder="e.g. 25 (for 25 minutes)"
						required
						{...register("cookingTime", {
							required: "Cooking time is required",
							valueAsNumber: true, // it runs before validation and returns NaN if value != number
							min: { value: 0, message: "Cooking time cannot be less than 0" },
							validate: {
								checkNumber: (value) =>
									!isNaN(value) ||
									"Enter valid cooking time in minutes (e.g. 25)",
							},
						})}
					/>
					<div className="flex gap-3 mt-2">
						<Button
							type="submit"
							bgColor="bg-[#4CAF50]"
							className="w-[7rem] p-2.5 rounded-xl text-sm"
						>
							Publish
						</Button>
						<Button
							type="submit"
							bgColor="bg-[#2196F3]"
							className="w-[7rem] p-2.5 rounded-xl text-sm"
						>
							Save Draft
						</Button>
						<Button
							type="button"
							bgColor="bg-[#E0E0E0]"
							textColor="text-[#333333]"
							className="w-[7rem] p-2.5 rounded-xl text-sm"
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
