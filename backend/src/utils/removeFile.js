import { unlink } from "node:fs/promises";

const removeLocalFile = async (localFilepath) => {
	try {
		await unlink(localFilepath);
	} catch (err) {
		console.log("Error deleting file from localserver", err);
	}
};

const removeRemoteFile = async (remoteFilepath) => {
	try {
		// delete file from cloudinary
	} catch (err) {
		console.log("Error deleting file", err);
	}
};

export { removeLocalFile, removeRemoteFile };
