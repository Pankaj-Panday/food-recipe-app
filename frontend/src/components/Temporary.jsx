import React from "react";
import userService from "../services/user.service";
import recipeService from "../services/recipe.service";

const Temporary = () => {
	return (
		<div>
			<h1 className="text-5xl text-center my-8">Frontend is in progress</h1>
			<p className="text-center">
				<a
					href="https://github.com/Pankaj-Panday/food-recipe-app"
					className="text-blue-600 underline"
					target="_blank"
					rel="noopener noreferrer"
				>
					Github link for backend
				</a>
			</p>
			<Button />
		</div>
	);
};

const Button = () => {
	const name = "User 1";
	const email = "user1@example.com";
	const password = "12345678";
	const newPassword = "1234567890";

	const recipe = {
		title: "Recipe 1",
		introduction: "This is introduction of recipe",
		recipePhoto: null,
		cookingTime: "25",
		ingredients: ["ingredient 1", "ingredient 2"],
		steps: ["This is step 1", "This is step 2", "This is step 3"],
		isPublished: true,
	};

	const handleBtnClick = async () => {
		// const response = await userService.register({ name, email, password });
		// const response = await userService.login({ email, password });
		// const response = await userService.current();
		// const response = await userService.refreshAccessToken();
		// const response = await userService.logout();
		// const response = await userService.updatePassword({
		// 	curPassword: password,
		// 	newPassword,
		// });
		// const response = await userService.updateDetails({ name: "User 1" });
		// const response = await userService.removeAvatar();
		// const response = await userService.getDetailsOfUser(
		// 	"6615086cbe3140638c953508"
		// );
		// const response = await userService.delete();
		// const response = await userService.savedRecipes();
		// const response = await userService.createdRecipesOfUser(
		// 	"6615086cbe3140638c953508"
		// );
		// const response = await recipeService.create(recipe);
		// const response = await recipeService.view("661529f244c290d8f0dad9e7");
		// const response = await recipeService.updateTextDetails(
		// 	"661529f244c290d8f0dad9e7",
		// 	{
		// 		...recipe,
		// 		cookingTime: "35",
		// 	}
		// );
		// const response = await recipeService.delete("661529f244c290d8f0dad9e7");
		const response = await recipeService.allRecipes();
		console.log(response);
	};
	return (
		<button
			type="button"
			className="p-2 bg-red-400 block mx-auto mt-5 text-white w-[150px] rounded-lg"
			onClick={handleBtnClick}
		>
			Click here
		</button>
	);
};

export default Temporary;
