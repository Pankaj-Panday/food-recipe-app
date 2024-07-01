import { unlink } from "node:fs/promises";

const removeLocalFile = async (localFilepath) => {
	try {
		await unlink(localFilepath);
	} catch (err) {
		console.log("Error deleting file from localserver", err);
	}
};

export { removeLocalFile };
