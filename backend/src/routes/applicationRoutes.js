import express from "express";
import { getMyApplications, applyToJob } from "../controllers/applicationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Verify token for all application routes
router.use(verifyToken);

router.get("/my-apps", getMyApplications);
router.post("/apply", applyToJob);

export default router; // Ensure this is default export