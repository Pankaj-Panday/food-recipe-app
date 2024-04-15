import React, { useState } from "react";
import {
	Container,
	Logo,
	Searchbar,
	Button,
	LogoutBtn,
	LoginForm,
} from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
	const [showLoginForm, setShowLoginForm] = useState(false);
	const [showSignUpForm, setShowSignUpForm] = useState(false);

	function openLoginForm() {
		setShowLoginForm(true);
	}
	function closeLoginForm() {
		setShowLoginForm(false);
	}

	function openSignUpForm() {}

	return (
		<>
			<header className="text-center py-5 ">
				<Container>
					<section className="flex justify-between items-center">
						<Link to="/">
							<Logo />
						</Link>
						<Searchbar />
						{!isLoggedIn ? (
							<div className="flex gap-2">
								<Button
									bgColor="bg-transparent"
									textColor="text-brand-primary"
									className="text-sm w-24 capitalize px-4 py-1.5 rounded-full border-2 border-brand-primary transition ease hover:bg-brand-primary hover:text-white"
									onClick={openSignUpForm}
								>
									Sign up
								</Button>
								<Button
									bgColor="bg-brand-primary-light"
									textColor="text-brand-primary"
									className="text-sm w-24 capitalize px-4  py-1.5 border-2 rounded-full border-transparent transition ease hover:bg-brand-primary hover:text-white"
									onClick={openLoginForm}
								>
									Log in
								</Button>
							</div>
						) : (
							<LogoutBtn />
						)}
					</section>
				</Container>
			</header>
			{showLoginForm && <LoginForm onClose={closeLoginForm} />}
		</>
	);
};

export default Header;
