import React, { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import { Input, Button } from "../index.js";
import foodImg from "../../assets/imgs/loginForm.jpg";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import userService from "../../services/user.service.js";
import { userLogin } from "../../app/authSlice.js";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// configure dev tools
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

	const {
		register,
		formState: { errors: frontendError, isSubmitting },
		handleSubmit,
		control,
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
				onClose();
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
						{error && (
							<small className="my-2 py-1.5 text-center text-red-700 bg-red-200 block rounded-lg">
								{frontendError.email?.message ||
									frontendError.password?.message ||
									backendError}
							</small>
						)}

						<form
							className="mt-2 flex flex-col gap-3"
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
								className="py-2 mt-3 w-4/5 h-10 mx-auto rounded-full flex justify-center items-center disabled:opacity-50 capitalize"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<AiOutlineLoading3Quarters className="animate-spin text-sm align-middle" />
								) : (
									<span>Log in</span>
								)}
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
