import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";

const Searchbar = () => {
	return (
		<form
			action=""
			className="flex rounded outline outline-2 outline-brand-primary"
		>
			<input
				type="text"
				placeholder="Find a recipe"
				className="px-2 py-1 rounded-l w-72 relative z-10 focus:outline-none "
			/>
			<button
				type="button"
				className="grid place-items-center w-8 bg-brand-primary text-white text-xl rounded-r"
			>
				<BiSearchAlt2 className="inline-block align-middle" />
			</button>
		</form>
	);
};

export default Searchbar;
