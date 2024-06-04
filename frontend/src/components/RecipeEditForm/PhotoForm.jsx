import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUpload } from "react-icons/fa";
import recipeService from "../../services/recipe.service";
import { CustomImageUpload, Button } from "../";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { DevTool } from "@hookform/devtools";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedRecipe } from "../../app/recipesSlice";

const PhotoForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors: frontendErrors, isSubmitting, isValid },
		control,
	} = useForm();

	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [photoDeleting, setPhotoDeleting] = useState(false);
	const [backendError, setBackendError] = useState(null);

	const error = frontendErrors?.photo?.message || backendError;

	const dispatch = useDispatch();
	const recipe = useSelector((state) => state.recipes.selectedRecipe);

	const onSubmit = async (data) => {
		const photo = data.photo[0];
		try {
			const res = await recipeService.updatePhotoOfRecipe(recipe._id, photo);
			if (res?.success) {
				dispatch(setSelectedRecipe(null));
				// the above line takes us to the view-recipe url since
				// in EditRecipePage.jsx there is condition that if there is
				// no recipe, we navigate to view-recipe page
			}
		} catch (error) {
			setBackendError(error.reason);
		}
	};

	const handleDeletePhoto = async (recipeId) => {
		try {
			setPhotoDeleting(true);
			const res = await recipeService.deletePhotoOfRecipe(recipeId);
			if (res?.success) {
				dispatch(setSelectedRecipe(null));
			}
		} catch (error) {
			setBackendError(error.reason);
		} finally {
			setPhotoDeleting(false);
		}
	};

	return (
		<section className="mt-4">
			<h3 className="mb-3 text-lg font-medium">Edit photo</h3>
			<div className="bg-[linear-gradient(352deg,rgba(2,0,36,1)0%,rgba(8,8,40,1)39%,rgba(131,131,131,1)100%)] sm:h-48 h-32 overflow-hidden aspect-video flex justify-center items-center">
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
			{photoDeleting && (
				<small className="inline-block mt-3 italic text-red-400">
					Deleting...
				</small>
			)}
			<div className="flex gap-2 my-3">
				<Button
					className="px-3 text-sm py-1.5 disabled:opacity-50 disabled:pointer-events-none rounded-md min-w-20 hover:bg-brand-primary-dark active:bg-brand-primary-dark"
					onClick={() => setShowUpdateForm(true)}
					disabled={isSubmitting || photoDeleting}
				>
					Change
				</Button>
				{!showUpdateForm && recipe?.recipePhoto.url && (
					<Button
						bgColor="bg-[#f22c3d]"
						className="grid w-8 rounded-md place-content-center disabled:opacity-50 disabled:pointer-events-none"
						title="Delete photo"
						onClick={() => handleDeletePhoto(recipe?._id)}
						disabled={photoDeleting}
					>
						<MdDelete size="1rem" />
					</Button>
				)}
			</div>
			{showUpdateForm && (
				<>
					<form>
						<fieldset
							disabled={isSubmitting}
							className="disabled:pointer-events-none disabled:opacity-50"
						>
							<CustomImageUpload
								register={register}
								label={
									<>
										<FaUpload /> <span>Upload file</span>
									</>
								}
								labelClass="inline-flex items-center gap-2 px-3 py-2 align-middle border rounded-md border-brand-primary text-brand-primary select-none"
							/>
							{error && (
								<small className="text-red-700 bg-red-200 py-1.5 px-3 mt-3 inline-block">
									<span className="font-semibold">Error: </span>
									{error}
								</small>
							)}
							<div className="flex gap-2 mt-3">
								<Button
									bgColor="bg-[#4CAF50]"
									className="px-3 py-1.5 rounded-md min-w-fit disabled:opacity-50 flex justify-center items-center gap-2 disabled:pointer-events-none"
									type="submit"
									onClick={handleSubmit(onSubmit)}
									// disabled={!isValid}
								>
									{isSubmitting ? (
										<>
											<span>Saving</span>
											<AiOutlineLoading3Quarters className="align-middle animate-spin" />{" "}
										</>
									) : (
										<span>Save</span>
									)}
								</Button>
								<Button
									bgColor="bg-[#E0E0E0]"
									textColor="text-[#333333]"
									className="px-3 py-1.5 rounded-md min-w-20 "
									onClick={() => setShowUpdateForm(false)}
								>
									Cancel
								</Button>
							</div>
						</fieldset>
					</form>
					<DevTool control={control} />
				</>
			)}
		</section>
	);
};

export default PhotoForm;
