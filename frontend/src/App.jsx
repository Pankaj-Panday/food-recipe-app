import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ErrorLayout from "./layout/ErrorLayout.jsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout />,
		errorElement: <ErrorLayout />,
		children: [
			{
				path: "home",
				element: <HomePage />,
			},
		],
	},
]);

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;
