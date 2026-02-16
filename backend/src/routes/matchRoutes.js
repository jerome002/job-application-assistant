import express from 'express';
import Match from '../models/Match.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/matches
router.get('/', verifyToken, async (req, res) => {
  try {
    // Find matches for the logged-in user and populate the job details
    const userMatches = await Match.find({ user: req.user._id })
      .populate('job')
      .sort({ score: -1 }); // Show best matches first

    res.json(userMatches);
  } catch (err) {
    console.error("Fetch Matches Error:", err);
    res.status(500).json({ message: "Error fetching matches" });
  }
});

export default router;