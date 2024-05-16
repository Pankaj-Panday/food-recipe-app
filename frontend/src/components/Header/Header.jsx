import React, { useEffect, useState } from "react";
import { MobileHeader, DesktopHeader } from "../index.js";

const Header = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 640);
		};
		window.addEventListener("resize", handleResize);
		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [setIsMobile]);

	return isMobile ? <MobileHeader /> : <DesktopHeader />;
};

export default Header;
