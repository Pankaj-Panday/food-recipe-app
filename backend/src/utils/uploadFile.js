import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs/promises";
import removeFileFrom from "./removeFile.js";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilepath) => {
	try {
		// Check if the local file path is provided.
		if (!localFilepath) {
			console.warn("No file path provided, returning null.");
			return null;
		}
		// Upload the file to Cloudinary using the uploader API.
		const result = await cloudinary.uploader.upload(localFilepath, {
			// Use the original filename on Cloudinary.
			use_filename: true,
			// Automatically determine the resource type (e.g., image, video).
			resource_type: "auto",
		});

		// Log success message with the uploaded file URL.
		// console.log("File successfully uploaded on Cloudinary:", result.url);	// for debugging

		// file sucessfully upload so remove file from backend server
		await fs.unlink(localFilepath);

		// Return the upload result object.
		return result;
	} catch (error) {
		console.error("Error uploading file:", error);
		// If upload fails, attempt to delete the local file to avoid clutter.
		await removeFileFrom(localFilepath);
		// Return null in case of an error.
		return null;
	}
};

export { uploadToCloudinary };
