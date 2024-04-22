import React from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import MainLayout from "./layout/MainLayout.jsx";
import {
	AddRecipePage,
	HomePage,
	LoginPage,
	SignUpPage,
	RecipePage,
} from "./pages/index.js";
import ErrorLayout from "./layout/ErrorLayout.jsx";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<MainLayout />} errorElement={<ErrorLayout />}>
			<Route index element={<HomePage />} />
			<Route path="home" element={<HomePage />} />
			<Route path="login" element={<LoginPage />} />
			<Route path="signup" element={<SignUpPage />} />
			<Route path="recipes/add-recipe" element={<AddRecipePage />} />
			<Route path="recipes/view-recipe/:recipeId" element={<RecipePage />} />
		</Route>
	)
);

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;
