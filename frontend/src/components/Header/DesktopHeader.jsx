import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Logo, Searchbar, Button, Navbar } from "../index";
import userService from "../../services/user.service.js";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { setAuthLoading, userLogout } from "../../app/authSlice.js";
import { useDispatch, useSelector } from "react-redux";

const DesktopHeader = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
	const authLoading = useSelector((state) => state.auth.loading);

	return (
		<header className="pt-5 pb-2 h-auto shadow-md sticky top-0 w-full z-[9999] bg-white">
			<Container>
				<section className="flex items-center justify-between gap-14">
					<Link to="/">
						<Logo />
					</Link>
					<Searchbar />

					{isLoggedIn ? (
						<div className="flex gap-2">
							<Button
								bgColor="bg-transparent"
								textColor="text-brand-primary"
								className="align-middle disabled:opacity-50"
								title="profile"
								disabled={authLoading}
								onClick={() => {
									navigate("/users/profile/current");
								}}
							>
								<FaUserCircle size="2rem" />
							</Button>
							<Button
								className="px-3 py-2 text-sm font-medium capitalize transition-all duration-100 border-2 w-28 ease border-brand-primary min-w-20 hover:bg-brand-primary disabled:opacity-50 hover:text-white "
								bgColor="bg-transparent"
								textColor="text-brand-primary"
								disabled={authLoading}
								onClick={() => {
									navigate("/add-recipe");
								}}
							>
								Add recipe
							</Button>
							<Button
								className="flex items-center justify-center px-3 py-2 text-sm font-medium capitalize transition-all duration-100 border-2 border-transparent w-28 disabled:opacity-50 ease min-w-20 hover:bg-brand-primary hover:text-white "
								bgColor="bg-brand-primary-light"
								textColor="text-brand-primary"
								disabled={authLoading}
								onClick={() => {
									dispatch(setAuthLoading(true));
									userService.logoutUser().then(() => {
										dispatch(setAuthLoading(false));
										dispatch(userLogout());
									});
								}}
							>
								{authLoading ? (
									<AiOutlineLoading3Quarters className="text-sm align-middle animate-spin" />
								) : (
									<span>Logout</span>
								)}
							</Button>
						</div>
					) : (
						<div className="flex gap-2">
							<Button
								className="w-24 px-3 py-2 text-sm font-medium capitalize transition-all duration-100 border-2 ease border-brand-primary min-w-20 hover:bg-brand-primary hover:text-white"
								bgColor="bg-transparent"
								textColor="text-brand-primary"
								onClick={() => navigate("/signup")}
							>
								Signup
							</Button>
							<Button
								className="w-24 px-3 py-2 text-sm font-medium capitalize transition-all duration-100 border-2 border-transparent ease min-w-20 hover:bg-brand-primary hover:text-white"
								bgColor="bg-brand-primary-light"
								textColor="text-brand-primary"
								onClick={() => navigate("/login")}
							>
								Login
							</Button>
						</div>
					)}
				</section>
				<section>
					<Navbar />
				</section>
			</Container>
		</header>
	);
};

export default DesktopHeader;
