import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Header, Footer } from "../components";
import { Outlet } from "react-router-dom";
import userService from "../services/user.service.js";
import { userLogin, userLogout } from "../app/authSlice.js";

const MainLayout = () => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		userService
			.currentUser()
			.then(({ data }) => {
				dispatch(userLogin(data));
			})
			.catch((error) => {
				dispatch(userLogout());
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return loading ? (
		<AppLoading />
	) : (
		<>
			<Header />
			<main className="my-8">
				<Outlet />
			</main>
			<Footer />
		</>
	);
};

const AppLoading = () => {
	return (
		<div className="min-h-scree flex justify-center">
			<h3 className="text-gray-500 text-4xl text-center mt-10">...Loading</h3>
		</div>
	);
};

export default MainLayout;
