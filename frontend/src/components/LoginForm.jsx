import React, { useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { Input, Button } from "./index.js";
import foodImg from "../assets/imgs/loginForm.jpg";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";

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

	const { register, control, handleSubmit } = useForm();

	function onSubmit(data, event) {
		console.log(data);
	}

	return (
		<>
			<div
				id="overlay"
				className="min-h-screen min-w-full absolute inset-0 flex justify-center items-start md:items-center backdrop-blur-lg bg-black/10 overflow-hidden"
			>
				<div
					id="formContainer"
					className="flex flex-col md:h-[400px] md:flex-row gap-2 md:gap-1 w-[min(300px,95%)] md:min-w-[600px] md:w-1/2 md:max-w-2xl min-w-[250px] border border-gray-100 mt-12 md:mt-0 mb-16 bg-white rounded-xl drop-shadow-xl"
				>
					<div className="h-[240px] md:h-full md:flex-1 overflow-hidden rounded-t-xl md:rounded-tr-none md:rounded-bl-xl">
						<img
							className="h-full w-full object-cover"
							src={foodImg}
							alt="food image"
						/>
					</div>
					<div className="md:flex-1 md:self-center mx-3 mb-4 md:mb-0">
						<h2 className="text-2xl font-medium mb-3">Log In</h2>
						<p className="text-gray-600">
							Log in to save and review your favorite recipes.
						</p>
						<form
							className="mt-4 flex flex-col gap-4"
							onSubmit={handleSubmit(onSubmit)}
						>
							<Input
								label="Email"
								type="email"
								placeholder="Your email"
								className="py-2 rounded-lg"
								{...register("email", {
									required: "Email is required",
									pattern: {
										value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
										message: "Invalid email format",
									},
								})}
							/>
							<Input
								label="Password"
								type="password"
								placeholder="Your password"
								className="py-2 rounded-lg"
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 8,
										message: "Password can't be less than 8 characters",
									},
								})}
							/>
							<Button
								type="submit"
								className="py-2 mt-3 w-4/5 mx-auto rounded-full"
							>
								Login
							</Button>
						</form>
					</div>
					<button
						className="grid place-content-center h-7 w-7 rounded-full text-black  bg-white text-xl absolute right-2 top-2"
						onClick={onClose}
					>
						<FaXmark size="0.9rem" />
					</button>
				</div>
			</div>
			<DevTool control={control} />
		</>
	);
};

export default LoginForm;
