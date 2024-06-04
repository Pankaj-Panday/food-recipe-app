import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById, setUserDetails } from "../app/userSlice";
import {
	Container,
	Button,
	RecipeGrid,
	CustomImageUpload,
} from "../components";
import {
	fetchCreatedRecipesOfUser,
	fetchSavedRecipes,
} from "../app/recipesSlice";
import { useForm } from "react-hook-form";
import userService from "../services/user.service";

const UserProfilePage = () => {
	const { userId } = useParams();
	// check if user Id is equal to the userId of the logged In user
	// so no need to fetch details should be there in redux state
	// also some of the options shouldn't be visible if user isn't viewing his own profile

	const [recipeTypeToShow, setRecipeTypeToShow] = useState("created");

	const dispatch = useDispatch();
	const loggedInUser = useSelector((state) => state.auth.user);
	const user = useSelector((state) => state.user.userDetails);
	const isLoggedInUserProfile = loggedInUser?._id === userId;
	const createdRecipes = useSelector(
		(state) => state.recipes.createdRecipes.data
	);
	const loadingCreatedRecipes = useSelector(
		(state) => state.recipes.createdRecipes.loading
	);
	const errorIncreatedRecipes = useSelector(
		(state) => state.recipes.createdRecipes.error
	);
	const savedRecipes = useSelector((state) => state.recipes.savedRecipes.data);
	const loadingSavedRecipes = useSelector(
		(state) => state.recipes.savedRecipes.loading
	);
	const errorInSavedRecipes = useSelector(
		(state) => state.recipes.savedRecipes.error
	);

	useEffect(() => {
		//if logged in user is not viewing his profile then we need to fetch the data
		if (isLoggedInUserProfile) {
			dispatch(setUserDetails(loggedInUser));
		} else {
			dispatch(fetchUserById(userId));
		}
	}, [dispatch, userId, loggedInUser]);

	useEffect(() => {
		// fetch created recipes of user
		dispatch(fetchCreatedRecipesOfUser(userId));
	}, [userId]);

	let recipeGridContent;
	if (loadingCreatedRecipes || loadingSavedRecipes) {
		recipeGridContent = (
			<div className="my-5 text-center text-gray-400 se sm:my-10 min-h-[30vh] flex items-center justify-center">
				<p className="mb-2 tracking-wide">Please wait. Loading recipes...</p>
			</div>
		);
	} else if (errorIncreatedRecipes || errorInSavedRecipes) {
		recipeGridContent = (
			<div className="my-5 text-center text-gray-400 se sm:my-10 min-h-[30vh] flex items-center justify-center">
				<p className="mb-2 tracking-wide">
					Error: There is some problem fetching recipes
				</p>
			</div>
		);
	} else if (createdRecipes || savedRecipes) {
		recipeGridContent =
			recipeTypeToShow === "created" ? (
				<RecipeGrid recipes={createdRecipes} />
			) : (
				<RecipeGrid recipes={savedRecipes} />
			);
	}

	return (
		<article className="my-8">
			<Container>
				<section className="flex flex-col gap-4 sm:gap-10 sm:flex-row ">
					<div className="flex flex-col items-center justify-center gap-3 sm: sm:items sm:gap-1">
						<div className="inline-block my-3 overflow-hidden rounded-full outline outline-offset-4 outline-gray-500 outline-1 aspect-square h-72">
							<img
								src={user?.avatar?.url || "/userDefaultDp.jpg"}
								alt="Profile picture"
								className="object-cover object-center w-full h-full"
							/>
						</div>
						{isLoggedInUserProfile && <PhotoForm />}
					</div>
					<div className="mt-4 sm:mt-10 max-sm:text-center">
						<h3 className="text-2xl font-semibold">{user?.name}</h3>
						<p className="my-2 text-sm font-semibold text-gray-400">
							{user?.email}
						</p>
						{isLoggedInUserProfile && (
							<>
								<Button className="px-3 py-1.5 rounded-md">
									Change Password
								</Button>
								<Button
									bgColor="bg-transparent"
									textColor="text-red-500"
									className="block mt-4 text-sm font-bold"
								>
									Delete Account
								</Button>
							</>
						)}
					</div>
				</section>
				<hr className="my-8" />
				<section>
					<div className="flex items-center justify-between">
						<Button
							bgColor={
								recipeTypeToShow === "created" ? "bg-gray-200" : "bg-gray-100"
							}
							textColor="text-gray-700"
							className="w-1/2 py-2 min-w-fit"
							onClick={() => {
								setRecipeTypeToShow("created");
							}}
						>
							Created Recipes
						</Button>
						{isLoggedInUserProfile && (
							<Button
								bgColor={
									recipeTypeToShow === "saved" ? "bg-gray-200" : "bg-gray-100"
								}
								textColor="text-gray-700"
								className="flex-1 w-1/2 py-2 min-w-fit"
								onClick={() => {
									setRecipeTypeToShow("saved");
									dispatch(fetchSavedRecipes());
								}}
							>
								Saved Recipes
							</Button>
						)}
					</div>
					{recipeGridContent}
				</section>
			</Container>
		</article>
	);
};

const PhotoForm = () => {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting: isChanging, errors: photoChangeError },
	} = useForm();

	const navigate = useNavigate();
	const [isDeleting, setIsDeleting] = useState(false);
	const [backendError, setBackendError] = useState(null);
	const error = photoChangeError?.photo?.message || backendError;

	const user = useSelector((state) => state.user.userDetails);

	const onPhotoChange = async (data) => {
		const newPhoto = data.photo[0];
		try {
			const res = await userService.updateUserAvatar(newPhoto);
			if (res?.success) {
				navigate(0);
			}
		} catch (error) {
			setBackendError(error.reason);
		}
	};

	const onPhotoDelete = async () => {
		try {
			// delete the user profile picture
			setIsDeleting(true);
			const res = await userService.removeUserAvatar();
			if (res?.success) {
				navigate(0);
			}
		} catch (error) {
			setBackendError(error.reason);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<div className="flex items-center justify-center gap-3">
				{isChanging || isDeleting ? (
					<p className="text-sm italic text-brand-primary">Processing...</p>
				) : (
					<>
						<form onSubmit={handleSubmit(onPhotoChange)}>
							<CustomImageUpload
								register={register}
								imgPreview={false}
								info={false}
								labelClass="text-sm text-brand-primary"
								label="Change"
								onChange={(e) => {
									if (e.target.files && e.target.files.length > 0)
										handleSubmit(onPhotoChange)();
								}}
							/>
						</form>
						{user?.avatar?.url && (
							<Button
								bgColor="bg-transparent"
								textColor="text-brand-primary"
								className="text-sm"
								onClick={onPhotoDelete}
							>
								Delete
							</Button>
						)}
					</>
				)}
			</div>
			{error && !isDeleting && !isChanging && (
				<small className="block px-2 py-1 text-center text-red-700 bg-red-200 rounded-lg">
					<span className="font-semibold">Error: </span>
					{error}
					<span>. Try again!</span>
				</small>
			)}
		</>
	);
};

export default UserProfilePage;
