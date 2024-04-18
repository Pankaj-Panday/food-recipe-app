import React, { useState } from "react";
import {
	Container,
	Logo,
	Searchbar,
	Button,
	LogoutBtn,
	LoginForm,
	SignUpForm,
} from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
	const [showLoginForm, setShowLoginForm] = useState(false);
	const [showSignUpForm, setShowSignUpForm] = useState(false);
	const navigate = useNavigate();

	function openLoginForm() {
		setShowLoginForm(true);
	}
	function closeLoginForm() {
		setShowLoginForm(false);
	}

	function openSignUpForm() {
		setShowSignUpForm(true);
	}

	function closeSignUpForm() {
		setShowSignUpForm(false);
	}

	return (
		<>
			<header className="text-center h-auto shadow-md fixed top-0 w-full z-[99] bg-white">
				<Container>
					<section className="flex h-20 justify-between items-center">
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
							<div className="flex gap-2">
								<Button
									onClick={() => navigate("/add-recipe")}
									className="px-2 rounded-lg"
									bgColor="bg-brand-primary-light"
									textColor="text-brand-primary"
								>
									Add Recipe
								</Button>
								<LogoutBtn />
							</div>
						)}
					</section>
				</Container>
			</header>
			{showLoginForm && <LoginForm onClose={closeLoginForm} />}
			{showSignUpForm && <SignUpForm onClose={closeSignUpForm} />}
		</>
	);
};

export default Header;
