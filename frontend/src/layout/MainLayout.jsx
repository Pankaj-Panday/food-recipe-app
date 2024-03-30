import React from "react";
import { Header, Footer } from "../components";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
	return (
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
