import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email already exists. If it does, return an error.
    const userFound = await User.findOne({ email });

    if (userFound) {
      return res
        .status(400)
        .send("Email already in use. Please try with another email");
    }

    const user = await User.create({ email, password });

    return res.status(201).json({
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Internal server error", data: error.mesage });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Search for user using email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message:
          "No user with the given email found. Please use a different email or sign up",
      });
    }

    // Check if the password is correct.
    const auth = await compare(password, user.password);

    if (!auth) {
      return res
        .status(404)
        .json({ message: "Incorrect password. Please try again" });
    }

    // create a cookie.
    res.cookie("jwt", createToken(email, user._id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicturePath: user.profilePicturePath,
        profileSetup: user.profileSetup,
        backgroundColorCode: user.backgroundColorCode,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Internal server error", data: error.mesage });
  }
};

export const getProfile = async (req, res) => {
  try {
    // Search for user profile using the userId sent in request.
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User found",
      user,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Internal server error", data: error.mesage });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, backgroundColorCode } = req.body;

    // Look for the user and update.
    const user = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName, backgroundColorCode },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Profile updated succesfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Internal server error", data: error.mesage });
  }
};

export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { profilePicturePath: fileName },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      image: updatedUser.profilePicturePath,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Internal server error", data: error.mesage });
  }
};

export const removeProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profilePicturePath) {
      unlinkSync(user.profilePicturePath);
    }

    user.profilePicturePath = null;
    await User.save();

    return res
      .status(200)
      .json({ message: "Profile image removed successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "Internal server error", data: error.mesage });
  }
};
