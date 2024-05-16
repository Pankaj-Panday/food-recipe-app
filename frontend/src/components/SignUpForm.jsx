import React, { useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { Input, Button } from "./index.js";
import foodImg from "../assets/imgs/signupForm.jpg";
import { useForm } from "react-hook-form";
import userService from "../services/user.service.js";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { userLogin } from "../app/authSlice.js";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SignUpForm = () => {
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
			const { name, email, password, avatar } = formData;
			const { data } = await userService.registerUser({
				name,
				email,
				password,
				avatar: avatar[0],
			});
			if (data.user) {
				dispatch(userLogin(data.user));
				navigate("/");
			}
		} catch (error) {
			setBackendError(error.reason);
		}
	}

	return (
		<>
			<div id="overlay" className="overlay">
				<div
					id="formContainer"
					className="md:h-[630px] my-7 md:mt-0 sign-log-container"
				>
					<div className="h-[240px] md:h-full md:flex-1 overflow-hidden rounded-t-xl md:rounded-tr-none md:rounded-bl-xl">
						<img
							className="object-cover w-full h-full"
							src={foodImg}
							alt="food image"
						/>
					</div>
					<div className="mx-3 mb-4 md:flex-1 md:self-center md:mb-0">
						<h2 className="mb-3 text-2xl font-medium">Sign Up</h2>
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
							className="flex flex-col gap-3 mt-2"
							noValidate
						>
							<Input
								label="Name"
								type="text"
								placeholder="Your name"
								required
								{...register("name", { required: "Name is required" })}
								className="py-2 rounded-lg disabled:opacity-40"
								disabled={isSubmitting}
							/>
							<Input
								label="Email"
								type="email"
								placeholder="Your email"
								required
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
								required
								className="py-2 rounded-lg disabled:opacity-40"
								disabled={isSubmitting}
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 8,
										message: "Password should be at least 8 characters",
									},
								})}
							/>
							<Input
								label="Avatar"
								type="file"
								accept="image/png, image/jpeg"
								className="py-2 rounded-lg disabled:opacity-40"
								disabled={isSubmitting}
								{...register("avatar")}
							/>
							<Button
								type="submit"
								className="flex items-center justify-center w-4/5 h-10 py-2 mx-auto mt-3 capitalize rounded-full disabled:opacity-50"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<AiOutlineLoading3Quarters className="text-sm align-middle animate-spin" />
								) : (
									<span>Sign up</span>
								)}
							</Button>
							<p className="my-2 text-sm text-center text-gray-600">
								Already have an account ?{" "}
								<Link to="/login" className="text-brand-primary">
									Login
								</Link>
							</p>
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

export default SignUpForm;
