import express from "express";
import { getProfile, updateProfileStep } from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get current user profile
router.get("/", getProfile);

// Update a specific step of the profile
router.put("/", updateProfileStep);

export default router;
