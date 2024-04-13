/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"brand-primary": "#f15a24",
				"brand-primary-light": "#ffccb969",
			},
			fontFamily: {
				sans: ['"Poppins"', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [],
};
