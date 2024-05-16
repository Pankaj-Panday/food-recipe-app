import React, { useEffect } from "react";
import { SignUpForm } from "../components/index.js";

const SignUpPage = () => {
	useEffect(() => {
		document.querySelector("body").style.overflow = "hidden";
		return () => {
			document.querySelector("body").style.overflow = "unset";
		};
	}, []);
	return (
		<div className="min-h-[50px]">
			<SignUpForm />
		</div>
	);
};

export default SignUpPage;
