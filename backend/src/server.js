import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

// Initialize environment variables
dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Root Health Check Route
app.get("/", (req, res) => {
  res.send("Job Application Assistant API is running smoothly.");
});

// --- Database Connection & Server Start ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Verify MONGO_URI exists
if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    
    // Start the server only after the DB is connected
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1); // Exit process if DB connection fails
  });