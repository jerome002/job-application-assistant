import express from 'express';
import Match from '../models/Match.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import mongoose from 'mongoose'; // Add this import

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
  try {
    // 1. Ensure the ID is a proper MongoDB ObjectId
    const userId = new mongoose.Types.ObjectId(req.user.id); 

    console.log("Fetching matches for User ID:", userId);

    // 2. Query matches
    const userMatches = await Match.find({ user: userId }) 
      .populate('job') 
      .sort({ score: -1 });

    console.log(`Found ${userMatches.length} matches in database.`);
    res.json(userMatches);
  } catch (err) {
    console.error("Match Route Error:", err);
    res.status(500).json({ message: "Error fetching matches" });
  }
});

export default router;