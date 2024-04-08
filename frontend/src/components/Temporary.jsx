import React from "react";
import userService from "../services/user.service";

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

	const handleBtnClick = async () => {
		// const response = await userService.registerUser({ name, email, password });
		// const response = await userService.loginUser({ email, password });
		// const response = await userService.currentUser();
		// const response = await userService.logoutUser();
		const response = await userService.refreshAccessToken();
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
