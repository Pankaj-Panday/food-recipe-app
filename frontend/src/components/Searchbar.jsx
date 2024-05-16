import React, { useEffect, useRef } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { Button, Input } from "../components/index.js";
import { useDispatch, useSelector } from "react-redux";
import { removeFocus } from "../app/searchSlice.js";

const Searchbar = () => {
	const ref = useRef(null);
	// const dispatch = useDispatch();
	const searchBarFocus = useSelector((state) => state.searchBar.focus);

	useEffect(() => {
		if (searchBarFocus) {
			ref.current.focus();
		}
	}, [searchBarFocus]);

	return (
		<form action="" className="relative flex sm:w-96">
			<Input
				type="text"
				placeholder="Find a recipe"
				className="w-full py-2 border-brand-primary"
				newLine={false}
				ref={ref}
			/>
			<Button
				type="button"
				className="grid w-10 py-1 text-xl text-white place-items-center bg-brand-primary"
			>
				<BiSearchAlt2 className="inline-block align-middle" />
			</Button>
		</form>
	);
};

export default Searchbar;
