import React, { useId, forwardRef } from "react";

const Input = forwardRef(
	(
		{ type = "text", label, newLine = true, required, className, ...props },
		ref
	) => {
		const id = useId();
		let inputClass = newLine ? "block mt-1.5 w-full" : "";
		let requiredClass = required
			? "after:content-['*'] after:text-red-500 after:ml-0.5"
			: "";

		return (
			<div className="w-full h-full">
				{label && (
					<label htmlFor={id} className={`${requiredClass}`}>
						{label}
					</label>
				)}
				<input
					type={type}
					id={id}
					className={`border-2 h-full w-full px-2 py-1 bg-white outline-none focus:outline-none focus:border-brand-primary duration-200 focus:bg-slate-50 ${inputClass} ${className}`}
					{...props}
					ref={ref}
				/>
			</div>
		);
	}
);

export default Input;
