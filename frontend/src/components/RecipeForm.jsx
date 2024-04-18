import React from "react";
import { useForm } from "react-hook-form";
import { Button, Container, Input, Textarea } from "./index.js";

const RecipeForm = () => {
	return (
		<article className="py-6 w-[min(400px,95%)] min-w-[300px] sm:w-4/5 max-w-[660px] mx-auto">
			<div className="bg-gray-50 rounded-lg p-5">
				<h2 className="text-3xl font-bold mb-4">Add a recipe</h2>
				<form className="flex flex-col gap-4">
					<Input label="Recipe Title" className="" required />
					<Textarea label="Description" />
					<Input label="Photo" type="file" />

					{/* ingredients - dynamic field */}
					{/* steps - dynamic fields */}
					<Input label="Cooking Time" required />
					<div className="flex gap-3 mt-2">
						<Button
							type="submit"
							bgColor="bg-[#4CAF50]"
							className="w-[7rem] p-2.5 rounded-xl text-sm"
						>
							Publish
						</Button>
						<Button
							type="submit"
							bgColor="bg-[#2196F3]"
							className="w-[7rem] p-2.5 rounded-xl text-sm"
						>
							Save Draft
						</Button>
						<Button
							type="button"
							bgColor="bg-[#E0E0E0]"
							textColor="text-[#333333]"
							className="w-[7rem] p-2.5 rounded-xl text-sm"
						>
							Cancel
						</Button>
					</div>
				</form>
			</div>
		</article>
	);
};

export default RecipeForm;
