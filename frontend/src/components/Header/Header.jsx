import React from "react";
import { Navbar, Container, Logo, Searchbar } from "../index";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<header className="text-center py-5 ">
			<Container>
				<section className="flex justify-between items-center">
					<Logo />
					<Searchbar />
					<div className="flex gap-2">
						<Link
							to="/signup"
							className="text-sm w-24 capitalize px-4  py-1.5 border-2 rounded-full text-brand-primary border-brand-primary transition ease hover:bg-brand-primary hover:text-white "
						>
							Sign up
						</Link>
						<Link
							to="/login"
							className="text-sm w-24 capitalize px-4  py-1.5 border-2 rounded-full text-brand-primary border-transparent transition ease bg-brand-primary-light hover:bg-brand-primary hover:text-white "
						>
							Log in
						</Link>
					</div>
				</section>
				{/* <Navbar /> */}
			</Container>
		</header>
	);
};

export default Header;
