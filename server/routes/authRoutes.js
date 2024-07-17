import { Router } from "express";
import {
  signUp,
  login,
  getProfile,
  updateProfile,
  addProfileImage,
  removeProfileImage,
} from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.post("/sign-up", signUp);
authRoutes.post("/login", login);
authRoutes.get("/profile", getProfile);
authRoutes.put("/update-profile", updateProfile);
authRoutes.put("/add-profile-image", addProfileImage);
authRoutes.delete("/remove-profile-image", removeProfileImage);

export default authRoutes;
