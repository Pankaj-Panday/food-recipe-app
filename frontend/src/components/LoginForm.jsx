import React, { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { Input, Button } from "./index.js";
import foodImg from "../assets/imgs/loginForm.jpg";

const LoginForm = ({ onClose }) => {
	useEffect(() => {
		function handleOutsideClick(event) {
			if (event.target === overlay && event.target !== formContainer) {
				onClose();
			}
		}

		const overlay = document.getElementById("overlay");
		const formContainer = document.getElementById("formContainer");
		overlay.addEventListener("click", handleOutsideClick);

		return () => {
			overlay.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	return (
		<div
			id="overlay"
			className="min-h-screen min-w-full fixed inset-0 flex justify-center items-start overflow-scroll backdrop-blur-lg"
		>
			<div
				id="formContainer"
				className="border border-gray-100 mt-32 bg-white rounded-xl drop-shadow-xl "
			>
				<div className="">
					<img
						className="h-full w-full object-cover"
						src={foodImg}
						alt="food image"
					/>
				</div>
				<div className="">
					<h2 className="text-2xl font-medium mb-3">Log In</h2>
					<p className="text-gray-600">
						Log in to save and review your favorite recipes.
					</p>
					<Form />
				</div>
			</div>
		</div>
	);
};

const Form = () => {
	return (
		<form action="" className="mt-4 flex flex-col gap-4">
			<Input label="Email" type="email" />
			<Input label="Password" type="email" />
			<Button className="py-2 mt-3 min-w-32 rounded-full mx-auto">Login</Button>
		</form>
	);
};

export default LoginForm;

// <button
// 	className="grid place-content-center h-10 w-10 rounded-full text-brand-primary text-xl absolute right-0 top-0"
// 	onClick={onClose}
// >
// 	<FaXmark />
// </button>
