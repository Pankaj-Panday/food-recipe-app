import React, { useEffect, useState } from "react";
import { RecipeEditForm } from "../components";
import { Navigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSingleRecipe } from "../app/recipesSlice";

const EditRecipePage = () => {
	const { recipeId } = useParams();
	const dispatch = useDispatch();

	const loggedInUser = useSelector((state) => state.auth.user);
	const recipe = useSelector((state) => state.recipes.selectedRecipe);

	const [loader, setLoader] = useState(true);

	useEffect(() => {
		dispatch(fetchSingleRecipe(recipeId)).finally(() => {
			setLoader(false);
		});
	}, [recipeId]);

	if (loader) {
		return (
			<section className="flex items-center justify-center h-[400px] ">
				<h2 className="mb-4 text-xl text-center text-gray-400">Loading...</h2>
			</section>
		);
	} else if (recipe && loggedInUser?._id === recipe?.author._id) {
		return <RecipeEditForm />;
	} else {
		return <Navigate to={`/view-recipe/${recipeId}`} />;
	}
};

export default EditRecipePage;
