import React from "react";
import { Link } from "react-router-dom";
import { Container, Logo } from "./index.js";
import { FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
	return (
		<footer className="bg-[#F2F2F2]">
			<Container>
				<div className="md:flex justify-between py-8">
					<article className="grow">
						<Logo size="small" />
						<section>
							<h4 className="mt-7 mb-4 font-semibold">Follow us</h4>
							<ul className="flex gap-4">
								<li>
									<Link to="https://facebook.com" target="_blank">
										<FaFacebook color="#585858" size="1.25rem" />
									</Link>
								</li>
								<li>
									<Link to="https://youtube.com" target="_blank">
										<FaYoutube color="#585858" size="1.25rem" />
									</Link>
								</li>
								<li>
									<Link to="https://instagram.com" target="_blank">
										<FaInstagram color="#585858" size="1.25rem" />
									</Link>
								</li>
								<li>
									<Link to="https://twitter.com" target="_blank">
										<FaXTwitter color="#585858" size="1.25rem" />
									</Link>
								</li>
							</ul>
						</section>
					</article>
					<article className="md:flex md:justify-around md:grow-[2]">
						<ul className="max-md:my-8">
							{["Dinner", "meals", "ingredients", "occasions", "Cuisines"].map(
								(link) => (
									<li
										key={link}
										className="my-2 uppercase font-medium tracking-wide"
									>
										<Link to="#">{link}</Link>
									</li>
								)
							)}
						</ul>
						<ul className="max-md:my-8">
							{["About Us", "Product Vetting", "Advertise", "Contact"].map(
								(link) => (
									<li key={link} className="my-2">
										<Link to="#">{link}</Link>
									</li>
								)
							)}
						</ul>
						<ul>
							{[
								"Editorial Process",
								"Privacy Policy",
								"Terms of Service",
								"Careers",
							].map((link) => (
								<li key={link} className="my-2">
									<Link to="#">{link}</Link>
								</li>
							))}
						</ul>
					</article>
				</div>
			</Container>
			<p className="text-center text-sm text-gray-400 pb-2">
				&copy; No copyright 2024-{new Date().getFullYear()}
			</p>
		</footer>
	);
};

export default Footer;
