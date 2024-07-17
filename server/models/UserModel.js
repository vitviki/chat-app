import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    profilePicturePath: {
      type: String,
      required: false,
    },
    backgroundColorCode: {
      type: Number,
      required: false,
    },
    profileSetup: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Before storing user information, we're going to encrypt the password.
userSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
});

const User = mongoose.model("Users", userSchema);

export default User;
