import React, { useId, forwardRef } from "react";

const Input = forwardRef(
	({ type = "text", label, className, ...props }, ref) => {
		const id = useId();
		return (
			<div className="w-full">
				{label && <label htmlFor={id}>{label}</label>}
				<input
					type={type}
					id={id}
					className={`border-2 px-2 py-1 outline-none w-full focus:outline-none focus:border-brand-primary duration-200 focus:bg-slate-50  ${className}`}
					{...props}
					ref={ref}
				/>
			</div>
		);
	}
);

export default Input;
