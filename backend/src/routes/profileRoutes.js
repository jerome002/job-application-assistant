import express from "express";
import {
  getProfile,
  updateFullProfile // We only need the Master route now
} from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get the profile for the dashboard
router.get("/", verifyToken, getProfile);

// The "Atomic Sync" route used by the ReviewStep
router.put("/", verifyToken, updateFullProfile);

// Note: We removed updatePersonal, updateSkills, and updateExperience 
// because updateFullProfile handles all of them now.

export default router;