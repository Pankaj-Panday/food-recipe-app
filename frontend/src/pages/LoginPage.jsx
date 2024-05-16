import React, { useEffect } from "react";
import { LoginForm } from "../components/index.js";

const LoginPage = () => {
	useEffect(() => {
		document.querySelector("body").style.overflow = "hidden";
		return () => {
			document.querySelector("body").style.overflow = "unset";
		};
	}, []);
	return <LoginForm />;
};

export default LoginPage;
