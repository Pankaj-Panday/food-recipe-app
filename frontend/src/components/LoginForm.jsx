import React, { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { Input, Button } from "./index.js";
import foodImg from "../assets/imgs/loginForm.jpg";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from "../services/user.service.js";
import { userLogin } from "../app/authSlice.js";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoginForm = () => {
	useEffect(() => {
		function handleOutsideClick(event) {
			if (event.target === overlay && event.target !== formContainer) {
				navigate(-1);
			}
		}

		const overlay = document.getElementById("overlay");
		const formContainer = document.getElementById("formContainer");
		overlay.addEventListener("click", handleOutsideClick);

		return () => {
			overlay.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	const {
		register,
		formState: { errors: frontendError, isSubmitting },
		handleSubmit,
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const [backendError, setBackendError] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();

	async function onLogin(formData) {
		try {
			const { email, password } = formData;
			const { data } = await userService.loginUser({ email, password });
			if (data.user) {
				dispatch(userLogin(data.user));
				navigate("/");
			}
		} catch (error) {
			setBackendError(error.reason);
		}
	}

	const error = frontendError.email || frontendError.password || backendError;

	return (
		<>
			<div id="overlay" className="overlay">
				<div
					id="formContainer"
					className="md:h-[400px] mt-12 md:mt-0 sign-log-container"
				>
					<div className="h-[240px] md:h-full md:flex-1 overflow-hidden rounded-t-xl md:rounded-tr-none md:rounded-bl-xl">
						<img
							className="object-cover w-full h-full"
							src={foodImg}
							alt="food image"
						/>
					</div>
					<div className="mx-3 mb-4 md:flex-1 md:self-center md:mb-0">
						<h2 className="mb-3 text-2xl font-medium">Log In</h2>
						<p className="text-gray-600">
							Log in to save and review your favorite recipes.
						</p>
						{error && (
							<small className="my-2 py-1.5 text-center text-red-700 bg-red-200 block rounded-lg">
								{frontendError.email?.message ||
									frontendError.password?.message ||
									backendError}
							</small>
						)}

						<form
							className="flex flex-col gap-3 mt-2"
							onSubmit={handleSubmit(onLogin)}
							noValidate
						>
							<Input
								label="Email"
								type="email"
								required
								placeholder="Your email"
								className="py-2 rounded-lg disabled:opacity-40"
								disabled={isSubmitting}
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
								className="py-2 rounded-lg disabled:opacity-40"
								required
								disabled={isSubmitting}
								{...register("password", {
									required: "Password is required",
								})}
							/>
							<Button
								type="submit"
								className="flex items-center justify-center w-4/5 h-10 py-2 mx-auto mt-3 capitalize rounded-full disabled:opacity-50"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<AiOutlineLoading3Quarters className="text-sm align-middle animate-spin" />
								) : (
									<span>Log in</span>
								)}
							</Button>
						</form>
					</div>
					<button
						className="absolute grid text-xl text-black bg-white rounded-full place-content-center h-7 w-7 right-2 top-2"
						onClick={() => navigate(-1)}
					>
						<FaXmark size="0.9rem" />
					</button>
				</div>
			</div>
		</>
	);
};

export default LoginForm;
