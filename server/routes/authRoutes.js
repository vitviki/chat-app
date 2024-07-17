import { Router } from "express";
import {
  signUp,
  login,
  getProfile,
  updateProfile,
  addProfileImage,
  removeProfileImage,
} from "../controllers/authController.js";
import { verifyToken } from "../middlwares/authMiddleware.js";

const authRoutes = Router();

authRoutes.post("/sign-up", signUp);
authRoutes.post("/login", login);
authRoutes.get("/profile", verifyToken, getProfile);
authRoutes.put("/update-profile", verifyToken, updateProfile);
authRoutes.put("/add-profile-image", verifyToken, addProfileImage);
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);

export default authRoutes;
