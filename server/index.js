import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;
const databaseURL = process.env.MONGO_DB_CONNECTION_URL;

// Setup cors headers, cookie parser and json parser.
app.use(
  cors({
    origin: [process.env.CORS_ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use(cookieParser());
app.use(express.json());

// Setup routes.
app.use("/api/v1/auth", authRoutes); // Auth Routes

// Connect to DB and start the server
mongoose
  .connect(databaseURL)
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running at port: https://localhost:${PORT}`);
    });
    console.log("DB connection: successful");
  })
  .catch((err) => console.log(err.message));
