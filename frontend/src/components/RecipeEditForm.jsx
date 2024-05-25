import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import { FaUpload } from "react-icons/fa";
import { DevTool } from "@hookform/devtools";
import { Button, CustomImageUpload, Input } from ".";

const RecipeEditForm = ({ recipe }) => {
	// console.log(recipe);
	const [showFileInput, setShowFileInput] = useState(false);

	// photo form
	const photoForm = useForm();
	const {
		register: photoRegister,
		handleSubmit: handlePhotoSubmit,
		formState: { errors: photoErrors },
		control: photoControl,
	} = photoForm;

	const onPhotoFormSubmit = (data) => {
		console.log(data);
	};

	return (
		<article className="py-6 w-[min(400px,95%)] min-w-[300px] sm:w-4/5 max-w-[660px] mx-auto">
			<div className="p-5 rounded-lg bg-gray-50">
				<h2 className="mb-2 text-3xl font-bold ">Edit recipe</h2>
				<small className="italic text-gray-500">{recipe?.title}</small>
				<section className="mt-4">
					<h3 className="mb-3 text-lg font-medium">Edit photo</h3>
					<div className="bg-[linear-gradient(352deg,rgba(2,0,36,1)0%,rgba(8,8,40,1)39%,rgba(131,131,131,1)100%)] w-full overflow-hidden aspect-video flex justify-center items-center">
						{recipe.recipePhoto.url ? (
							<img
								className="object-cover object-center w-full h-full"
								src={recipe.recipePhoto.url}
								alt={`${recipe.title} image`}
							/>
						) : (
							<p className="text-sm text-white">Photo not available</p>
						)}
					</div>
					<div className="flex justify-between my-3">
						<Button
							className="px-3 py-1.5 rounded-md min-w-20 hover:bg-brand-primary-dark active:bg-brand-primary-dark"
							onClick={() => setShowFileInput(true)}
						>
							Change
						</Button>
						<Button
							className="grid w-10 rounded-md place-content-center hover:bg-brand-primary-dark active:bg-brand-primary-dark"
							title="Delete photo"
						>
							<MdDelete size="1.2rem" />
						</Button>
					</div>
					{showFileInput && (
						<>
							<form onSubmit={handlePhotoSubmit(onPhotoFormSubmit)}>
								<fieldset>
									<CustomImageUpload
										register={photoRegister}
										label={
											<>
												<FaUpload /> <span>Upload file</span>
											</>
										}
										labelClass="inline-flex items-center gap-2 px-3 py-2 align-middle border rounded-md border-brand-primary text-brand-primary select-none"
									/>
									<div className="flex gap-2">
										<Button
											className="px-3 py-1.5 rounded-md min-w-20 hover:bg-brand-primary-dark active:bg-brand-primary-dark mt-3"
											type="submit"
										>
											Save
										</Button>
										<Button
											className="px-3 py-1.5 rounded-md min-w-20 hover:bg-brand-primary-dark active:bg-brand-primary-dark mt-3"
											onClick={() => setShowFileInput(false)}
										>
											Cancel
										</Button>
									</div>
								</fieldset>
							</form>
							<DevTool control={photoControl} />
						</>
					)}
				</section>
				<hr className="my-6" />
				<section>
					<h3 className="mb-3 text-lg font-medium">Edit other details</h3>
				</section>
			</div>
		</article>
	);
};

export default RecipeEditForm;
