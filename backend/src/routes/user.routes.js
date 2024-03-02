import { Router } from "express";
import {
	loginUser,
	logoutUser,
	registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(loginUser);

// secured rotues
router.route("/logout").post(verifyToken, logoutUser);

export default router;
