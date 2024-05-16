import React from "react";
import Container from "./Container/Container";
import { Link } from "react-router-dom";

const Temporary = () => {
	return (
		<Container>
			<h1 className="my-8 text-5xl ">Frontend is in progress</h1>
			<div>
				<h3 className="text-xl ">Features implemented:</h3>
				<ul className="mt-2 mb-8 text-sm list-decimal list-inside">
					<li>Sign up</li>
					<li>Login/Logout</li>
					<li>
						View{" "}
						<Link to="/recipes" className="text-blue-600 underline">
							all recipes
						</Link>{" "}
						with pagination:{" "}
					</li>
					<li>View Single recipe with paginated reviews</li>
					<li>
						<Link className="text-blue-600 underline" to="/recipes/add-recipe">
							Create
						</Link>{" "}
						your own recipe
					</li>
					<li>Adding reviews</li>
				</ul>
			</div>
			<div>
				<h3 className="text-xl ">Features in progress:</h3>
				<ul className="mt-2 mb-8 text-sm"></ul>
			</div>
			<p className="mb-8">
				Backend is complete&nbsp;
				<a
					href="https://github.com/Pankaj-Panday/food-recipe-app"
					className="text-blue-600 underline"
					target="_blank"
					rel="noopener noreferrer"
				>
					Github link for backend
				</a>
			</p>
		</Container>
	);
};

export default Temporary;
