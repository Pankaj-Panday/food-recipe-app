import React, { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { Input, Button } from "./index.js";
import foodImg from "../assets/imgs/signupForm.jpg";
import { useForm } from "react-hook-form";
import userService from "../services/user.service.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../app/authSlice.js";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// configure dev tools
import { DevTool } from "@hookform/devtools";

const SignUpForm = ({ onClose }) => {
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
		control,
		formState: { errors: frontendError, isSubmitting },
		handleSubmit,
	} = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const [backendError, setBackendError] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const error =
		frontendError.name ||
		frontendError.email ||
		frontendError.password ||
		backendError;

	async function signup(formData) {
		try {
			const { name, email, password } = formData;
			const { data } = await userService.registerUser({
				name,
				email,
				password,
			});
			if (data.user) {
				onClose();
				dispatch(userLogin(data.user));
				navigate("/");
			}
		} catch (error) {
			setBackendError(error.reason);
		}
	}

	return (
		<>
			<div
				id="overlay"
				className="min-h-screen min-w-full absolute inset-0 flex justify-center items-start md:items-center backdrop-blur-lg bg-black/10 overflow-hidden"
			>
				<div
					id="formContainer"
					className="flex flex-col md:h-[490px] md:flex-row gap-2 md:gap-1 w-[min(360px,95%)] md:min-w-[600px] md:w-1/2 md:max-w-2xl min-w-[250px] mt-7 md:mt-0 mb-16 bg-white rounded-xl drop-shadow-xl"
				>
					<div className="h-[240px] md:h-full md:flex-1 overflow-hidden rounded-t-xl md:rounded-tr-none md:rounded-bl-xl">
						<img
							className="h-full w-full object-cover"
							src={foodImg}
							alt="food image"
						/>
					</div>
					<div className="md:flex-1 md:self-center mx-3 mb-4 md:mb-0">
						<h2 className="text-2xl font-medium mb-3">Sign Up</h2>
						<p className="text-gray-600">
							Sign up to save and review your favorite recipes.
						</p>
						{error && (
							<small className="my-2 py-1.5 text-center text-red-700 bg-red-200 block rounded-lg">
								{frontendError.name?.message ||
									frontendError.email?.message ||
									frontendError.password?.message ||
									backendError}
							</small>
						)}
						<form
							onSubmit={handleSubmit(signup)}
							className="mt-2 flex flex-col gap-3"
							noValidate
						>
							<Input
								label="Name"
								type="text"
								placeholder="Your name"
								className="py-2 rounded-lg"
								{...register("name", { required: "Name is required" })}
							/>
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
										message: "Password should be at least 8 characters",
									},
								})}
							/>
							<Button
								type="submit"
								className="py-2 mt-3 h-10 w-4/5 mx-auto rounded-full capitalize flex justify-center items-center disabled:opacity-50"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<AiOutlineLoading3Quarters className="animate-spin text-sm align-middle" />
								) : (
									<span>Sign up</span>
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

export default SignUpForm;
