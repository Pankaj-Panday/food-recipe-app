import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ height, width, className, ...props }) => {
	return (
		<Link to="/">
			<img src="/brand_logo.svg" className={`w-48`} />
		</Link>
	);
};

export default Logo;
