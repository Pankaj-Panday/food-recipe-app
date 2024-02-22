import React from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<div>HelloWorld</div>}></Route>
	)
);

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;
