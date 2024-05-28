import React from "react";

import { DetailsForm, PhotoForm } from "../";
import { useSelector } from "react-redux";

const RecipeEditForm = () => {
	const recipe = useSelector((state) => state.recipes.selectedRecipe);

	const handleClose = () => {
		setShowFileInput(false);
	};

	return (
		<article className="py-6 w-[min(400px,95%)] min-w-[300px] sm:w-4/5 max-w-[660px] mx-auto">
			<div className="p-5 rounded-lg bg-gray-50">
				<h2 className="mb-2 text-3xl font-bold ">Edit recipe</h2>
				<small className="italic text-gray-500">{recipe?.title}</small>
				<PhotoForm />
				<hr className="my-6" />
				<DetailsForm />
			</div>
		</article>
	);
};

export default RecipeEditForm;
