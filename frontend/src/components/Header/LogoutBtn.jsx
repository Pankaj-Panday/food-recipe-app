import React from "react";
import { Button } from "../index.js";
import { useDispatch } from "react-redux";
import { userLogout } from "../../app/authSlice.js";
import userService from "../../services/user.service.js";

const LogoutBtn = () => {
	const dispatch = useDispatch();
	return (
		<Button
			onClick={() => {
				userService
					.logoutUser()
					.then((response) => {
						dispatch(userLogout());
					})
					.catch((error) => {});
			}}
			className="text-sm w-24 capitalize px-4  py-1.5 border-2 rounded-full border-transparent transition ease hover:bg-brand-primary-light hover:text-brand-primary"
		>
			Log out
		</Button>
	);
};

export default LogoutBtn;
