import React, { useId, forwardRef } from "react";

const Input = forwardRef(
	({ type = "text", label, newLine = true, className, ...props }, ref) => {
		const id = useId();

		let inputClass = newLine ? "block mt-1.5 w-full" : "";

		return (
			<div className="w-full">
				{label && (
					<label htmlFor={id} className="inline">
						{label}
					</label>
				)}
				<input
					type={type}
					id={id}
					className={`border-2 px-2 py-1 outline-none focus:outline-none focus:border-brand-primary duration-200 focus:bg-slate-50 ${inputClass} ${className}`}
					{...props}
					ref={ref}
				/>
			</div>
		);
	}
);

export default Input;
