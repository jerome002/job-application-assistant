import express from "express";
import {
  getProfile,
  updatePersonal,
  updateSkills,
  updateExperience,
  updateFullProfile // 1. Import this!
} from "../controllers/profileController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getProfile);
router.put("/", verifyToken, updateFullProfile); // 2. ADD THIS LINE (The "Master" route)
router.put("/personal", verifyToken, updatePersonal);
router.put("/skills", verifyToken, updateSkills);
router.put("/experience", verifyToken, updateExperience);

export default router;