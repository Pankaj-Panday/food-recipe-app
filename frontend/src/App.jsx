import React from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path="/"
			element={
				<div>
					<h1 className="mt-20 text-center text-3xl">
						Front end not ready yet
					</h1>
				</div>
			}
		></Route>
	)
);

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;
