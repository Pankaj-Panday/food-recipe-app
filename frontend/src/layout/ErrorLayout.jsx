import React from "react";
import { useRouteError } from "react-router-dom";
import { Header, Footer } from "../components";

const ErrorLayout = () => {
	const error = useRouteError();
	console.error(error.error);
	return (
		<div className="relative flex flex-col justify-between min-h-screen">
			<Header />
			<main className="pt-5 text-center main-mt">
				<h1 className="mb-4 text-3xl font-bold">Oops!</h1>
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
