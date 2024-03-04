import { Router } from "express";
import {
	updateUserPassword,
	getCurrentUser,
	loginUser,
	logoutUser,
	refreshAccessToken,
	registerUser,
	updateUserAvatar,
	updateUserDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);

// secured rotues
router.route("/current").get(verifyToken, getCurrentUser);
router.route("/logout").post(verifyToken, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-password").patch(verifyToken, updateUserPassword);
router.route("/update-avatar").patch(verifyToken, updateUserAvatar);
router.route("/update-details").patch(verifyToken, updateUserDetails);

export default router;
