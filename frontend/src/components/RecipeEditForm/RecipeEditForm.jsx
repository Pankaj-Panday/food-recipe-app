import React, { useState } from "react";

import { DetailsForm, PhotoForm, Button } from "../";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RecipeEditForm = () => {
	const navigate = useNavigate();

	const recipe = useSelector((state) => state.recipes.selectedRecipe);
	const [showPhotoForm, setShowPhotoForm] = useState(true);
	const [showDetailsForm, setShowDetailsForm] = useState(false);

	return (
		<article className="py-6 w-[min(400px,95%)] min-w-[300px] sm:w-4/5 max-w-[660px] mx-auto">
			<div className="p-5 rounded-lg bg-gray-50">
				<h2 className="mb-2 text-3xl font-bold ">Edit recipe</h2>
				<small className="block italic text-gray-500">{recipe?.title}</small>

				<div className="flex justify-between mt-4 ">
					<Button
						bgColor={showPhotoForm ? "bg-gray-200" : "bg-gray-100"}
						textColor="text-gray-700"
						className="flex-1 py-2 text-sm"
						onClick={() => {
							setShowPhotoForm(true);
							setShowDetailsForm(false);
						}}
					>
						Edit Photo
					</Button>
					<Button
						bgColor={showDetailsForm ? "bg-gray-200" : "bg-gray-100"}
						textColor="text-gray-700"
						className="flex-1 text-sm"
						onClick={() => {
							setShowDetailsForm(true);
							setShowPhotoForm(false);
						}}
					>
						Edit Details
					</Button>
				</div>
				<Button
					bgColor="bg-transparent"
					textColor="text-brand-primary"
					className="block mt-3 hover:text-brand-primary-dark"
					onClick={() => {
						recipe?._id ? navigate(`/view-recipe/${recipe._id}`) : navigate(-1);
					}}
				>
					<span>&larr;</span> Go Back
				</Button>
				{showPhotoForm && <PhotoForm />}
				{/* <hr className="my-6" /> */}
				{showDetailsForm && <DetailsForm />}
			</div>
		</article>
	);
};

export default RecipeEditForm;
