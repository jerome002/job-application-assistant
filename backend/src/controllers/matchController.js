import Match from "../models/Match.js";
import mongoose from "mongoose";

// Get matches for logged-in user
export const getMatches = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const matches = await Match.find({ user: userId }).populate("job").sort({ score: -1 });

    res.json({ success: true, data: { matches } });
  } catch (err) {
    console.error("Get Matches Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch matches" });
  }
};