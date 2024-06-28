import React, { useId, forwardRef } from "react";

const Input = forwardRef(
  (
    { type = "text", label, newLine = true, required, className, ...props },
    ref,
  ) => {
    const id = useId();
    let inputClass = newLine ? "block mt-1.5 w-full" : "";
    let requiredClass = required
      ? "after:content-['*'] after:text-red-500 after:ml-0.5"
      : "";

    return (
      <div className="h-full w-full">
        {label && (
          <label htmlFor={id} className={`${requiredClass}`}>
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          className={`h-full w-full border-2 bg-white px-2 py-1 outline-none duration-200 focus:border-brand-primary focus:bg-slate-50 focus:outline-none ${inputClass} ${className}`}
          {...props}
          ref={ref}
        />
      </div>
    );
  },
);

export default Input;
