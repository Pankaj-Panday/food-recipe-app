import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUpload } from "react-icons/fa";
import recipeService from "../../services/recipe.service";
import { CustomImageUpload, Button } from "../";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
// import { DevTool } from "@hookform/devtools";
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
  const recipe = useSelector((state) => state.recipes.selectedRecipe.data);

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
      <div className="flex aspect-video h-32 items-center justify-center overflow-hidden bg-[linear-gradient(352deg,rgba(2,0,36,1)0%,rgba(8,8,40,1)39%,rgba(131,131,131,1)100%)] sm:h-48">
        {recipe.recipePhoto.url ? (
          <img
            className="h-full w-full object-cover object-center"
            src={recipe.recipePhoto.url}
            alt={`${recipe.title} image`}
          />
        ) : (
          <p className="text-sm text-white">Photo not available</p>
        )}
      </div>
      {photoDeleting && (
        <small className="mt-3 inline-block italic text-red-400">
          Deleting...
        </small>
      )}
      <div className="my-3 flex gap-2">
        <Button
          className="min-w-20 rounded-md px-3 py-1.5 text-sm hover:bg-brand-primary-dark active:bg-brand-primary-dark disabled:pointer-events-none disabled:opacity-50"
          onClick={() => setShowUpdateForm(true)}
          disabled={isSubmitting || photoDeleting}
        >
          Change
        </Button>
        {!showUpdateForm && recipe?.recipePhoto.url && (
          <Button
            bgColor="bg-[#f22c3d]"
            className="grid w-8 place-content-center rounded-md disabled:pointer-events-none disabled:opacity-50"
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
                <small className="mt-3 inline-block bg-red-200 px-3 py-1.5 text-red-700">
                  <span className="font-semibold">Error: </span>
                  {error}
                </small>
              )}
              <div className="mt-3 flex gap-2">
                <Button
                  bgColor="bg-[#4CAF50]"
                  className="flex min-w-fit items-center justify-center gap-2 rounded-md px-3 py-1.5 disabled:pointer-events-none disabled:opacity-50"
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  // disabled={!isValid}
                >
                  {isSubmitting ? (
                    <>
                      <span>Saving</span>
                      <AiOutlineLoading3Quarters className="animate-spin align-middle" />{" "}
                    </>
                  ) : (
                    <span>Save</span>
                  )}
                </Button>
                <Button
                  bgColor="bg-[#E0E0E0]"
                  textColor="text-[#333333]"
                  className="min-w-20 rounded-md px-3 py-1.5"
                  onClick={() => setShowUpdateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </fieldset>
          </form>
          {/* <DevTool control={control} /> */}
        </>
      )}
    </section>
  );
};

export default PhotoForm;
