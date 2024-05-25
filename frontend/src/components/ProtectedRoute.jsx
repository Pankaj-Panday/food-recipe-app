import React from "react";
import { useSelector } from "react-redux";
import { LoginPage } from "../pages";

const ProtectedRoute = ({ children }) => {
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

	if (!isLoggedIn) {
		return <LoginPage />;
	} else {
		return <>{children}</>;
	}
};

export default ProtectedRoute;
