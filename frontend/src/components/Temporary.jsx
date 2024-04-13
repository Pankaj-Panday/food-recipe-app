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
	const handleBtnClick = async () => {};
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
