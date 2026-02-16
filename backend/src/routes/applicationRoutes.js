import express from 'express';
import Application from '../models/Application.js'; // Added .js extension
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: /api/applications/my-apps
router.get('/my-apps', verifyToken, async (req, res) => {
  try {
    // Note: Ensure your auth middleware attaches 'id' or '_id' to req.user
    const userId = req.user.id || req.user._id;
    const apps = await Application.find({ userId });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// POST: /api/applications/apply
router.post('/apply', verifyToken, async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id || req.user._id;

    const newApp = new Application({
      userId: userId,
      jobId,
      status: 'Pending',
      createdAt: new Date()
    });

    await newApp.save();
    res.status(201).json(newApp);
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ message: "Apply failed" });
  }
});

// This is the line that fixes the 'default' error
export default router;