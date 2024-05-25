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
	AllRecipes,
	EditRecipePage,
} from "./pages/index.js";
import { ProtectedRoute } from "./components";
import ErrorLayout from "./layout/ErrorLayout.jsx";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<MainLayout />} errorElement={<ErrorLayout />}>
			<Route index element={<HomePage />} />
			<Route path="home" element={<HomePage />} />
			<Route path="login" element={<LoginPage />} />
			<Route path="signup" element={<SignUpPage />} />
			<Route path="recipes" element={<AllRecipes />} />
			<Route
				path="add-recipe"
				element={
					<ProtectedRoute>
						<AddRecipePage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="edit-recipe/:recipeId"
				element={
					<ProtectedRoute>
						<EditRecipePage />
					</ProtectedRoute>
				}
			/>
			<Route path="view-recipe/:recipeId" element={<RecipePage />} />
		</Route>
	)
);

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;
