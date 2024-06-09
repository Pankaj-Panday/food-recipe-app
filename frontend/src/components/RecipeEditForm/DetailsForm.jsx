import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Input, Textarea } from "../";
import { MdDelete } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { setSelectedRecipe } from "../../app/recipesSlice";
import { DevTool } from "@hookform/devtools";
import recipeService from "../../services/recipe.service";

const DetailsForm = () => {
  const recipe = useSelector((state) => state.recipes.selectedRecipe.data);
  const dispatch = useDispatch();

  const [backendError, setBackendError] = useState("");
  const [publish, setPublish] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors: frontendError, isSubmitting },
  } = useForm({
    defaultValues: {
      title: recipe.title,
      introduction: recipe.introduction,
      ingredients: recipe.ingredients.map((item) => ({ ingredient: item })),
      steps: recipe.steps.map((item) => ({ step: item })),
      cookingTime: recipe.cookingTime,
    },
  });

  const {
    fields: ingredientFields,
    append: addIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    name: "ingredients",
    control,
  });

  const {
    fields: stepFields,
    append: addStep,
    remove: removeStep,
  } = useFieldArray({
    name: "steps",
    control,
  });

  const onSubmit = async (formData) => {
    const data = {
      title: formData.title,
      introduction: formData.introduction || "",
      cookingTime: String(formData.cookingTime),
      ingredients: formData.ingredients.map((item) => item.ingredient),
      steps: formData.steps.map((item) => item.step),
      isPublished: publish,
    };
    try {
      const res = await recipeService.updateTextDetailsOfRecipe(
        recipe._id,
        data,
      );
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

  return (
    <section className="mt-4">
      <h3 className="mb-3 text-lg font-medium">Edit other details</h3>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <fieldset
          className="flex flex-col gap-4 disabled:opacity-65"
          disabled={isSubmitting}
        >
          <Input
            required
            label="Recipe Title"
            className="rounded-md"
            {...register("title", {
              required: "Recipe title is required",
              pattern: {
                value: /^[a-zA-Z0-9\s/-]+$/,
                message:
                  "Only (a-z, A-Z, 0-9,-, /) characters are allowed in recipe title",
              },
            })}
          />
          {frontendError?.title && (
            <small className="font-semibold text-red-500">
              {frontendError.title.message}
            </small>
          )}
          <Textarea
            label="Description"
            className="min-h-24 rounded-md"
            {...register("introduction")}
          />
          <ul className="flex flex-col gap-2">
            {ingredientFields.map((field, index) => {
              return (
                <li key={field.id} className="flex items-center gap-2">
                  <Input
                    required
                    label={index === 0 ? "Ingredients" : null}
                    className="rounded-md"
                    {...register(`ingredients.${index}.ingredient`, {
                      required: "Ingredient cannot be empty",
                    })}
                  />
                  {index > 0 && (
                    <Button
                      bgColor="bg-[#f22c3d]"
                      title="Delete"
                      className="mt-1.5 grid place-content-center rounded p-1.5 hover:bg-[#d61e2e]"
                      onClick={() => removeIngredient(index)}
                    >
                      <MdDelete className="text-base" />
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
          {frontendError?.ingredients && (
            <small className="font-semibold text-red-500">
              {
                frontendError.ingredients.find(
                  (elem) => elem?.ingredient.message,
                ).ingredient.message
              }
            </small>
          )}
          <Button
            className="max-w-fit rounded-md px-2 py-1.5 text-sm"
            onClick={() => addIngredient({ ingredient: "" })}
          >
            Add Ingredient
          </Button>

          <ul className="flex flex-col gap-2">
            {stepFields.map((field, index) => {
              return (
                <li key={field.id} className="flex items-start gap-2">
                  <Textarea
                    label={index === 0 ? "Steps" : null}
                    className="min-h-fit overflow-auto rounded-md"
                    required
                    {...register(`steps.${index}.step`, {
                      required: "Steps cannot be empty",
                    })}
                  />
                  {index > 0 && (
                    <Button
                      className="mt-1.5 grid place-content-center rounded p-1.5 hover:bg-[#d61e2e]"
                      bgColor="bg-[#f22c3d]"
                      title="Delete"
                      onClick={() => removeStep(index)}
                    >
                      <MdDelete />
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
          {frontendError?.steps && (
            <small className="font-semibold text-red-500">
              {
                frontendError.steps.find((elem) => elem?.step.message).step
                  .message
              }
            </small>
          )}
          <Button
            className="max-w-fit rounded-md px-2 py-1.5 text-sm"
            onClick={() => addStep({ step: "" })}
          >
            Add steps
          </Button>
          <Input
            label="Cooking Time"
            required
            type="number"
            className="rounded-md"
            placeholder="e.g. 25 (for 25 minutes)"
            {...register("cookingTime", {
              required: "Cooking time is required",
              valueAsNumber: true,
              min: {
                value: 0,
                message: "Cooking time cannot be less than 0",
              },
              validate: {
                checkNumber: (value) =>
                  !isNaN(value) ||
                  "Enter valid cooking time in minutes (e.g. 25)",
              },
            })}
          />
          {frontendError?.cookingTime && (
            <small className="font-semibold text-red-500">
              {frontendError.cookingTime.message}
            </small>
          )}
          {backendError && !Object.keys(frontendError).length && (
            <small className="rounded-md bg-red-100 p-2 font-semibold text-red-500">
              <span className="font-bold">Server error: </span>{" "}
              <span>{backendError}</span>
            </small>
          )}
        </fieldset>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            type="submit"
            bgColor="bg-[#4CAF50]"
            className="flex min-w-[80px] items-center justify-center rounded-md px-3 py-2 disabled:opacity-50"
            onClick={() => setPublish(true)}
            disabled={isSubmitting}
          >
            {isSubmitting && publish ? (
              <AiOutlineLoading3Quarters className="animate-spin align-middle" />
            ) : (
              <span>Save</span>
            )}
          </Button>
          <Button
            type="submit"
            bgColor="bg-[#2196F3]"
            className="flex min-w-[120px] items-center justify-center rounded-md px-3 py-2 disabled:opacity-50"
            onClick={() => setPublish(false)}
            disabled={isSubmitting}
          >
            {isSubmitting && !publish ? (
              <AiOutlineLoading3Quarters className="animate-spin align-middle" />
            ) : (
              <span>Save Draft</span>
            )}
          </Button>
        </div>
      </form>
      {/* <DevTool control={control} /> */}
      <small className="mt-2 inline-block text-gray-500">
        <span className="font-semibold text-gray-700">Note: </span> saving draft
        will unpublish the recipe
      </small>
    </section>
  );
};

export default DetailsForm;
