import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, Input, Textarea } from "./index.js";
import { MdDelete } from "react-icons/md";
import recipeService from "../services/recipe.service.js";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import { DevTool } from "@hookform/devtools";

const RecipeForm = () => {
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState(null);
  const [publish, setPublish] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors: frontendError, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      introduction: "",
      cookingTime: "",
      ingredients: [{ ingredient: "" }], // here
      steps: [{ step: "" }], // and here
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    name: "ingredients",
    control,
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    name: "steps",
    control,
  });

  const onSubmit = async (recipeData) => {
    try {
      const {
        title,
        introduction,
        recipePhoto,
        ingredients,
        steps,
        cookingTime,
      } = recipeData;

      const { data } = await recipeService.createRecipe({
        title,
        introduction,
        recipePhoto: recipePhoto[0],
        ingredients: ingredients.map((item) => item.ingredient),
        steps: steps.map((item) => item.step),
        cookingTime,
        isPublished: publish,
      });
      setBackendError("");
      navigate(`/view-recipe/${data._id}`);
    } catch (error) {
      setBackendError(
        error.reason.charAt(0).toUpperCase() + error.reason.slice(1),
      );
    }
  };

  return (
    <article className="mx-auto w-[min(400px,95%)] min-w-[300px] max-w-[660px] py-6 sm:w-4/5">
      <div className="rounded-lg bg-gray-50 p-5">
        <h2 className="mb-4 text-3xl font-bold">Add a recipe</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <fieldset
            disabled={isSubmitting}
            className="flex flex-col gap-4 disabled:opacity-65"
          >
            <Input
              label="Recipe Title"
              placeholder="e.g. Paneer tikka masala"
              className="rounded-md"
              required
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
              placeholder="Share something special about your recipe"
              {...register("introduction")}
            />
            <Input
              label="Photo"
              type="file"
              className="rounded-md"
              accept="image/*"
              {...register("recipePhoto")}
            />
            <ul className="flex flex-col gap-2">
              {ingredientFields.map((field, index) => {
                const label = index === 0 ? "Ingredients" : null;
                return (
                  <li key={field.id} className="flex items-center gap-2">
                    <Input
                      label={label}
                      placeholder="e.g. 250g paneer"
                      required
                      className="rounded-md"
                      {...register(`ingredients.${index}.ingredient`, {
                        required: "Ingredients cannot be empty",
                      })}
                    />
                    {index > 0 && (
                      <Button
                        className="mt-1.5 grid place-content-center rounded p-1.5 hover:bg-[#d61e2e]"
                        bgColor="bg-[#f22c3d]"
                        onClick={() => removeIngredient(index)}
                        title="Delete"
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
                    (err) => err?.ingredient.message,
                  ).ingredient.message
                }
              </small>
            )}
            <Button
              className="w-[130px] rounded-lg px-2 py-1.5 text-sm"
              onClick={() => appendIngredient({ ingredient: "" })}
            >
              Add Ingredient
            </Button>
            <ul className="flex flex-col gap-2">
              {stepFields.map((field, index) => {
                const label = index === 0 ? "Steps" : null;
                return (
                  <li key={field.id} className="flex items-start gap-2">
                    <Textarea
                      label={label}
                      className="h-12 min-h-12 rounded-md"
                      placeholder="e.g. Boil mixture for 10 minutes"
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
                  frontendError.steps.find((err) => err?.step.message).step
                    .message
                }
              </small>
            )}
            <Button
              className="w-[90px] rounded-lg px-2 py-1.5 text-sm"
              onClick={() => appendStep({ step: "" })}
            >
              Add Step
            </Button>
            <Input
              type="number"
              label="Cooking Time (in mins)"
              placeholder="e.g. 25 (for 25 minutes)"
              required
              className="rounded-md"
              {...register("cookingTime", {
                required: "Cooking time is required",
                valueAsNumber: true, // it runs before validation and returns NaN if value != number
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
              className="flex w-[7rem] min-w-[6.5rem] items-center justify-center rounded-xl p-2 disabled:opacity-50"
              disabled={isSubmitting}
              onClick={() => setPublish(true)}
            >
              {isSubmitting && publish ? (
                <AiOutlineLoading3Quarters className="animate-spin align-middle" />
              ) : (
                <span>Publish</span>
              )}
            </Button>
            <Button
              type="submit"
              bgColor="bg-[#2196F3]"
              className="flex w-[7rem] min-w-[6.5rem] items-center justify-center rounded-xl p-2 disabled:opacity-50"
              disabled={isSubmitting}
              onClick={() => setPublish(false)}
            >
              {isSubmitting && !publish ? (
                <AiOutlineLoading3Quarters className="animate-spin align-middle" />
              ) : (
                <span>Save Draft</span>
              )}
            </Button>
            <Button
              type="button"
              bgColor="bg-[#E0E0E0]"
              textColor="text-[#333333]"
              className="w-[7rem] min-w-[6.5rem] rounded-xl p-2 disabled:opacity-50"
              disabled={isSubmitting}
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
        {/* <DevTool control={control} /> */}
      </div>
    </article>
  );
};

export default RecipeForm;
