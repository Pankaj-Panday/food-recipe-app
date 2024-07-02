import { Router } from "express";
import {
	updateUserPassword,
	getCurrentUser,
	loginUser,
	logoutUser,
	refreshAccessToken,
	registerUser,
	updateUserAvatar,
	removeUserAvatar,
	updateUserDetails,
	getUserDetails,
	deleteUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// secured rotues
router.route("/current").get(verifyToken, getCurrentUser);
router.route("/logout").post(verifyToken, logoutUser);
router.route("/update-password").patch(verifyToken, updateUserPassword);
router
	.route("/update-avatar")
	.patch(verifyToken, upload.single("avatar"), updateUserAvatar);
router.route("/remove-avatar").patch(verifyToken, removeUserAvatar);
router.route("/update-details").patch(verifyToken, updateUserDetails);
router.route("/:userId").get(verifyToken, getUserDetails);
router.route("/delete").delete(verifyToken, deleteUser);

export default router;
