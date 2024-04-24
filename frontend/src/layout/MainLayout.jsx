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
				if (error?.reason === "jwt expired" && error?.statusCode === 401) {
					// Access token expired, try refreshing
					userService
						.refreshAccessTokenOfUser()
						.then(() => {
							userService
								.currentUser()
								.then(({ data }) => dispatch(userLogin(data)))
								.catch((err) => {
									// fetching user data after refresh
									console.error(
										"Failed to get current user after refreshing access token"
									);
									dispatch(userLogout());
								});
						})
						.catch((err) => {
							console.error("Failed to refresh access token");
							dispatch(userLogout());
						});
				}
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return loading ? (
		<AppLoading />
	) : (
		<div className="relative flex flex-col justify-between min-h-screen overflow-hidden">
			<Header />
			<main className="pt-20">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

const AppLoading = () => {
	return (
		<div className="flex justify-center min-h-scree">
			<h3 className="mt-10 text-4xl text-center text-gray-500">...Loading</h3>
		</div>
	);
};

export default MainLayout;
