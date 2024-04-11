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
		<div>...Loading</div>
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

export default MainLayout;
