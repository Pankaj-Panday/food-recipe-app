import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { Input } from "../components/index.js";

const Searchbar = () => {
	return (
		<form action="" className="flex rounded w-80 relative">
			<Input
				type="text"
				placeholder="Find a recipe"
				className="border-brand-primary rounded-l-lg"
			/>
			<button
				type="button"
				className="grid place-items-center w-10 bg-brand-primary text-white text-xl rounded-r-lg"
			>
				<BiSearchAlt2 className="inline-block align-middle" />
			</button>
		</form>
	);
};

export default Searchbar;
