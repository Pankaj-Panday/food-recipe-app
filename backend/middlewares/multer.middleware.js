import multer from "multer";

// Configure disk storage for uploaded files
const storage = multer.diskStorage({
	// Set the destination directory for uploaded files
	destination: "/tmp/uploads",
	// Generate a unique filename for each uploaded file
	filename: function (req, file, callback) {
		// Create a unique suffix using current timestamp and random number
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000);
		// Combine the original filename with the unique suffix
		callback(null, file.originalname + "-" + uniqueSuffix);
	},
});

// Create a multer instance with the defined storage configuration
const upload = multer({ storage: storage });

export { upload };
