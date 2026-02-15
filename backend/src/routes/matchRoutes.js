import express from 'express';
import Match from '../models/Match.js';
import { verifyToken } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Get all matches for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const matches = await Match.find({ user: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.patch('/:matchId/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body; // status will be 'applied'
    const match = await Match.findOneAndUpdate(
      { _id: req.params.matchId, user: req.user._id },
      { status },
      { new: true }
    );
    
    if (!match) return res.status(404).json({ message: "Match not found" });
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;