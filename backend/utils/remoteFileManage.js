import { v2 as cloudinary } from "cloudinary";

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
		const response = await cloudinary.uploader.upload(localFilepath, {
			// Use the original filename on Cloudinary.
			use_filename: true,
			// Automatically determine the resource type (e.g., image, video).
			resource_type: "auto",
		});

		// Log success message with the uploaded file URL.
		// console.log("File successfully uploaded on Cloudinary:", response.url);	// for debugging

		// Return the upload response object.
		return response;
	} catch (error) {
		console.error("Error uploading file:", error);
		// Return null in case of an error.
		return null;
	}
};

const removeFromCloudinary = async (remoteFilePublicId) => {
	// this method return null when there is error or public id isn't provided.
	try {
		if (!remoteFilePublicId) {
			console.log("No public id provided, returning null");
			return null;
		}
		const response = await cloudinary.uploader.destroy(remoteFilePublicId, {
			resource_type: "image",
		});
		return response;
		// response is JSON like this {"result": "ok"};
	} catch (error) {
		console.log("Error delete remote file: ", error);
		return null;
	}
};

export { uploadToCloudinary, removeFromCloudinary };
