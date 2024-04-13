import React from "react";

const Logo = ({ height, width, size = "normal", className, ...props }) => {
	const sizes = {
		normal: "w-[12rem]",
		small: "w-[9rem]",
	};

	const sizeClass = sizes[size];
	const imgStyle = {
		height: `${height}`,
		width: `${width}`,
	};

	return (
		<img
			src="/brand_logo.svg"
			style={imgStyle}
			className={`${sizeClass} ${className}`}
			{...props}
		/>
	);
};

export default Logo;
