import React from "react";
import { useRouteError } from "react-router-dom";
import { Header, Footer } from "../components";

const ErrorLayout = () => {
	const error = useRouteError();
	console.error(error.error);
	return (
		<div className="flex flex-col justify-between min-h-screen relative">
			<Header />
			<main className="text-center">
				<h1 className="font-bold text-3xl mb-4">Oops!</h1>
				<p>Sorry, an unexpected error has occurred.</p>
				<p className="mt-2 text-gray-500">
					{error.status} {error.statusText}
				</p>
			</main>
			<Footer />
		</div>
	);
};

export default ErrorLayout;
