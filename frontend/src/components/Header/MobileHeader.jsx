import React from "react";
import { Container, Logo, Button, Menu } from "../index";
import { IoMenu } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openMenu } from "../../app/menuSlice";
import { setFocus } from "../../app/searchSlice";

const MobileHeader = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const showMenu = useSelector((state) => {
		return state.menu.show;
	});

	const handleOpenMenu = () => {
		dispatch(openMenu());
		document.querySelector("body").style.overflow = "hidden";
	};

	return (
		<header className="py-5 h-auto shadow-md sticky top-0 w-full z-[9999] bg-white">
			<Container>
				<section className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Button
							bgColor="bg-transparent"
							textColor="text-gray-800"
							onClick={handleOpenMenu}
						>
							<span className="sr-only">open menu</span>
							<IoMenu size="1.5rem" />
						</Button>
						<Link to="/">
							<Logo size="extrasmall" />
						</Link>
					</div>
					<div className="flex items-center gap-2">
						<Button
							className="pr-4 border-r-2"
							bgColor="bg-transparent"
							textColor="text-gray-800"
							onClick={() => {
								dispatch(openMenu());
								dispatch(setFocus());
								document.querySelector("body").style.overflow = "hidden";
							}}
						>
							<IoMdSearch size="1.5rem" />
						</Button>

						<Button
							bgColor="bg-transparent"
							textColor="text-brand-primary"
							className="align-middle"
							title="profile"
							onClick={() => {
								navigate("/users/profile/current");
							}}
						>
							<FaUserCircle size="1.5rem" />
						</Button>
					</div>
				</section>
			</Container>
			{showMenu && <Menu />}
		</header>
	);
};

export default MobileHeader;
