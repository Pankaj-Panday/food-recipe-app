import React, { useId, forwardRef } from "react";

const Textarea = forwardRef(
	({ label, newLine = true, required, className, ...props }, ref) => {
		const id = useId();

		const textareaClass = newLine ? "w-full block mt-1.5" : null;
		let requiredClass = required
			? "after:content-['*'] after:text-red-500 after:ml-0.5"
			: "";

		return (
			<div className="w-full">
				{label && (
					<label htmlFor={id} className={`${requiredClass}`}>
						{label}
					</label>
				)}
				<textarea
					id={id}
					className={`border-2 px-2 py-1 outline-none focus:outline-none focus:border-brand-primary duration-200 focus:bg-slate-50 w-full ${textareaClass} ${className}`}
					ref={ref}
					{...props}
				></textarea>
			</div>
		);
	}
);

export default Textarea;
