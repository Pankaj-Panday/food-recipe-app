import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserById,
  setUserDetails,
  resetUserDetails,
} from "../app/userSlice";
import {
  Container,
  Button,
  RecipeGrid,
  Input,
  CustomImageUpload,
} from "../components";
import {
  fetchCreatedRecipesOfUser,
  fetchSavedRecipes,
} from "../app/recipesSlice";
import { MdOutlineEdit } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiWarning } from "react-icons/ci";
import { useForm } from "react-hook-form";
import userService from "../services/user.service";
import { userLogout } from "../app/authSlice";

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
    (state) => state.recipes.createdRecipes.data,
  );
  const loadingCreatedRecipes = useSelector(
    (state) => state.recipes.createdRecipes.loading,
  );
  const errorIncreatedRecipes = useSelector(
    (state) => state.recipes.createdRecipes.error,
  );
  const savedRecipes = useSelector((state) => state.recipes.savedRecipes.data);
  const loadingSavedRecipes = useSelector(
    (state) => state.recipes.savedRecipes.loading,
  );
  const errorInSavedRecipes = useSelector(
    (state) => state.recipes.savedRecipes.error,
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
      <div className="se my-5 flex min-h-[30vh] items-center justify-center text-center text-gray-400 sm:my-10">
        <p className="mb-2 tracking-wide">Please wait. Loading recipes...</p>
      </div>
    );
  } else if (errorIncreatedRecipes || errorInSavedRecipes) {
    recipeGridContent = (
      <div className="se my-5 flex min-h-[30vh] items-center justify-center text-center text-gray-400 sm:my-10">
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

  const [isNameEditing, setIsNameEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);

  const handleCloseNameForm = () => {
    setIsNameEditing(false);
  };

  return (
    <article className="my-8">
      <Container>
        <section className="flex flex-col justify-between gap-4 border px-3 max-sm:py-3 sm:flex-row sm:gap-10 sm:px-10 sm:py-5">
          <div className="sm: sm:items flex flex-1 flex-col items-center justify-center gap-3 sm:gap-1">
            <div className="my-3 inline-block aspect-square h-72 overflow-hidden rounded-full outline outline-1 outline-offset-4 outline-gray-500">
              <img
                src={user?.avatar?.url || "/userDefaultDp.jpg"}
                alt="Profile picture"
                className="h-full w-full object-cover object-center"
              />
            </div>
            {isLoggedInUserProfile && <PhotoForm />}
          </div>
          <div className="mt-4 flex-1">
            {isNameEditing ? (
              <NameForm onClose={handleCloseNameForm} />
            ) : (
              <div className="flex items-center justify-between sm:pr-5">
                <h3 className="h-[45px] align-middle text-2xl font-semibold leading-[45px]">
                  {user?.name}
                </h3>
                {isLoggedInUserProfile && (
                  <Button
                    bgColor="bg-transparent"
                    textColor="text-brand-primary"
                    className="text-2xl"
                    onClick={() => setIsNameEditing(true)}
                  >
                    <MdOutlineEdit />
                  </Button>
                )}
              </div>
            )}
            <p className="my-4 text-sm font-light text-gray-400">
              {user?.email}
            </p>
            {isLoggedInUserProfile && (
              <>
                <Button
                  className="rounded-md px-3 py-1.5"
                  onClick={() => {
                    setShowPasswordForm(true);
                  }}
                >
                  Change Password
                </Button>
                <Button
                  bgColor="bg-transparent"
                  textColor="text-red-600"
                  className="mt-3 block text-sm font-bold"
                  onClick={() => {
                    setShowAccountForm(true);
                  }}
                >
                  Delete Account
                </Button>
              </>
            )}
          </div>
          {showPasswordForm && (
            <Popup
              content={
                <PasswordForm onClose={() => setShowPasswordForm(false)} />
              }
            />
          )}
          {showAccountForm && (
            <Popup
              content={
                <AccountForm onClose={() => setShowAccountForm(false)} />
              }
            />
          )}
        </section>
        <hr className="my-8" />
        <section>
          <div className="flex items-center justify-between">
            <Button
              bgColor={
                recipeTypeToShow === "created" ? "bg-gray-200" : "bg-gray-100"
              }
              textColor="text-gray-700"
              className="w-1/2 min-w-fit py-2"
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
                className="w-1/2 min-w-fit flex-1 py-2"
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
        <small className="block rounded-lg bg-red-200 px-2 py-1 text-center text-red-700">
          <span className="font-semibold">Error: </span>
          {error}
          <span>. Try again!</span>
        </small>
      )}
    </>
  );
};

const NameForm = ({ onClose }) => {
  const user = useSelector((state) => state.user.userDetails);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors: frontendError, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user.name,
    },
  });

  const [backendError, setBackendError] = useState(null);
  const error = frontendError?.name?.message || backendError;

  const onSubmit = async (data) => {
    try {
      const res = await userService.updateUserDetails(data.name);
      if (res?.success) {
        navigate(0);
      }
    } catch (error) {
      setBackendError(error.reason);
    }
  };

  useEffect(() => {
    setFocus("name");
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset
        className="flex items-center justify-between disabled:opacity-50"
        disabled={isSubmitting}
      >
        <Input
          type="text"
          className="min-w-[100px] border-none text-2xl font-semibold"
          newLine={false}
          {...register("name", { required: "Name cannot be empty" })}
        />
        <div className="flex gap-2">
          <Button type="submit" className="rounded-md px-3 py-1">
            Ok
          </Button>
          <Button onClick={onClose} className="rounded-md px-3 py-1">
            Cancel
          </Button>
        </div>
      </fieldset>
      {error && (
        <small className="ml-2 mt-2 block text-red-400">
          <span className="font-bold">Error: </span>
          {error}
        </small>
      )}
    </form>
  );
};

const Popup = ({ content }) => {
  useEffect(() => {
    if (content) {
      document.querySelector("body").style.overflow = "hidden";

      return () => {
        document.querySelector("body").style.overflow = "unset";
      };
    }
  }, []);

  if (!content) return null;

  return (
    <article className="overlay items-center">
      <section className="relative min-w-48 rounded-md bg-white p-4 drop-shadow-xl max-sm:w-[90%]">
        <div className="mt-6">{content}</div>
      </section>
    </article>
  );
};

const PasswordForm = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors: frontendError, isSubmitting },
  } = useForm();

  const [backendError, setBackendError] = useState(null);

  const onSubmit = async (data) => {
    try {
      const res = await userService.updateUserPassword(
        data.curPassword,
        data.newPassword,
      );
      if (res?.success) {
        alert("Password changed");
        onClose();
      }
    } catch (error) {
      setBackendError(error.reason);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-3 sm:p-5">
      <fieldset
        className="flex flex-col gap-3 disabled:opacity-50 sm:w-80"
        disabled={isSubmitting}
      >
        <Input
          type="password"
          label="Current Password"
          required
          className="rounded-md py-2"
          {...register("curPassword", { required: "This is required field" })}
        />
        {frontendError?.curPassword && (
          <small className="font-semibold text-red-500">
            {frontendError?.curPassword?.message}
          </small>
        )}
        <Input
          type="password"
          label="New Password"
          required
          className="rounded-md py-2"
          {...register("newPassword", {
            required: "This is required field",
            minLength: {
              value: 8,
              message: "Password should be at least 8 characters",
            },
          })}
        />
        {frontendError?.newPassword && (
          <small className="font-semibold text-red-500">
            {frontendError?.newPassword?.message}
          </small>
        )}
      </fieldset>
      {backendError && (
        <small className="mt-3 block rounded-md bg-red-200 py-1.5 text-center text-red-700">
          <span className="font-bold">Error: </span> {backendError}
        </small>
      )}
      <Button
        type="submit"
        className="mt-3 flex w-full items-center justify-center rounded-md py-2 uppercase disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span>Submitting&nbsp;</span>
            <AiOutlineLoading3Quarters className="animate-spin align-middle" />
          </>
        ) : (
          <span>Submit</span>
        )}
      </Button>
      {!isSubmitting && (
        <Button
          bgColor="bg-transparent"
          textColor="text-black"
          className="absolute right-4 top-4 text-2xl"
          onClick={onClose}
        >
          <IoMdClose />
        </Button>
      )}
    </form>
  );
};

const AccountForm = ({ onClose }) => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = async () => {
    try {
      setProcessing(true);
      const res = await userService.deleteUser();
      if (res?.success) {
        alert("Account deleted successfully");
        dispatch(userLogout());
        dispatch(resetUserDetails());
        onClose();
        navigate("/");
      }
    } catch (error) {
      setError(error.reason);
    } finally {
      setProcessing(false);
    }
  };
  return (
    <section className="flex flex-col items-center gap-3 text-center">
      <div className="text-5xl text-yellow-500 md:text-9xl">
        <CiWarning />
      </div>
      <h2 className="text-xl font-bold sm:text-3xl">Proceed with deletion?</h2>
      <small className="font-medium">
        You are permanently deleting your account. All recipes created by you
        will be deleted.
      </small>
      {error && (
        <small className="block rounded-md bg-red-200 px-2 py-1.5 text-center text-red-700">
          <span className="font-bold">Error: </span> {error} Some error
        </small>
      )}
      {processing ? (
        <small className="italic text-red-400">Deleting your account...</small>
      ) : (
        <Button
          type="submit"
          bgColor="bg-[#f22c3d]"
          className="min-w-[60px] rounded-md px-3 py-1.5 hover:bg-[#fc0016] active:bg-[#fc0016]"
          onClick={handleClick}
        >
          Yes
        </Button>
      )}
      {!processing && (
        <Button
          bgColor="bg-transparent"
          textColor="text-black"
          className="absolute right-4 top-4 text-2xl"
          onClick={onClose}
        >
          <IoMdClose />
        </Button>
      )}
    </section>
  );
};

export default UserProfilePage;
