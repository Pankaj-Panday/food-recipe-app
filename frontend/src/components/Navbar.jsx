import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { closeMenu } from "../app/menuSlice";

const Navbar = () => {
	const dispatch = useDispatch();

	const navItems = [
		{
			name: "home",
			url: "/",
			show: true,
		},
		{
			name: "recipes",
			url: "/recipes",
			show: true,
		},
		{
			name: "features",
			url: "/features",
			show: true,
		},
		{
			name: "about",
			url: "/about",
			show: true,
		},
	];

	const handleNavItemClick = () => {
		dispatch(closeMenu());
		document.querySelector("body").style.overflow = "unset";
	};

	return (
		<section className={`h-navbar mt-6`}>
			<ul className="flex items-start h-full max-sm:flex-col gap-x-4 gap-y-5">
				{navItems.map((navItem) => {
					return (
						navItem.show && (
							<li
								key={navItem.url}
								className="text-sm font-semibold uppercase "
								onClick={handleNavItemClick}
							>
								<NavLink
									to={navItem.url}
									className={({ isActive }) =>
										isActive ? "text-brand-primary" : ""
									}
								>
									{navItem.name}
								</NavLink>
							</li>
						)
					);
				})}
			</ul>
		</section>
	);
};

export default Navbar;
