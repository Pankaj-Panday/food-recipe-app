import React from "react";
import { useRouteError } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const ErrorLayout = () => {
	const error = useRouteError();
	console.log(error);
	return (
		<>
			<Header />
			<div id="error-page">
				<h1>Oops!</h1>
				<p>Sorry, an unexpected error has occurred.</p>
				<p>
					{error.status} {error.statusText}
				</p>
			</div>
			<Footer />
		</>
	);
};

export default ErrorLayout;
