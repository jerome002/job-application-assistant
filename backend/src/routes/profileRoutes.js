import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET current profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Fetch Profile Error:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// Update full profile safely
router.put('/', verifyToken, async (req, res) => {
  try {
    const { personal, skills, experience } = req.body;

    // Make sure the user exists
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Initialize profile if undefined
    if (!user.profile) user.profile = {};
    if (!user.profile.skills) user.profile.skills = [];
    if (!user.profile.experience) user.profile.experience = [];

    // Update fields if provided
    if (personal) user.profile.personal = personal;
    if (skills) user.profile.skills = skills;
    if (experience) user.profile.experience = experience;

    await user.save();
    res.json({ message: "Profile updated successfully", profile: user.profile });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Update auto-apply setting
router.put('/settings', verifyToken, async (req, res) => {
  try {
    const { autoApply } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.profile) user.profile = {};
    if (!user.profile.settings) user.profile.settings = {};

    user.profile.settings.autoApply = autoApply ?? false;
    await user.save();

    res.json({ message: "Settings updated", autoApply: user.profile.settings.autoApply });
  } catch (err) {
    console.error("Settings Update Error:", err);
    res.status(500).json({ message: "Error updating settings" });
  }
});

export default router;