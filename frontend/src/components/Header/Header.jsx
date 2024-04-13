import React from "react";
import { Container, Logo, Searchbar, Button, LogoutBtn } from "../index";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userService from "../../services/user.service";
import { userLogin } from "../../app/authSlice";

const Header = () => {
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
	const dispatch = useDispatch();

	const handleLogin = () => {
		const user = {
			email: "user1@example.com",
			password: "12345678",
		};

		userService.loginUser(user).then(({ data }) => {
			dispatch(userLogin(data.user));
		});
	};

	return (
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
							>
								Sign up
							</Button>
							<Button
								bgColor="bg-brand-primary-light"
								textColor="text-brand-primary"
								className="text-sm w-24 capitalize px-4  py-1.5 border-2 rounded-full border-transparent transition ease hover:bg-brand-primary hover:text-white"
								onClick={handleLogin}
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
	);
};

export default Header;
