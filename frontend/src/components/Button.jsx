import React from "react";

const Button = ({
	children,
	type = "button",
	bgColor = "bg-brand-primary",
	textColor = "text-white",
	className,
	onClick,
	...props
}) => {
	return (
		<button
			type={type}
			className={`${bgColor} ${textColor} ${className}`}
			onClick={onClick}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
