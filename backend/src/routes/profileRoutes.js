import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. GET current profile & settings
// Endpoint: GET /api/profile
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// 2. NEW: Update full profile (Used by ReviewStep.jsx)
// Endpoint: PUT /api/profile
router.put('/', verifyToken, async (req, res) => {
  try {
    const { personal, skills, experience } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          "profile.personal": personal,
          "profile.skills": skills,
          "profile.experience": experience
        } 
      },
      { new: true, runValidators: true }
    );

    res.json({ message: "Profile updated successfully", profile: updatedUser.profile });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

// 3. Update auto-apply setting
// Endpoint: PUT /api/profile/settings
router.put('/settings', verifyToken, async (req, res) => {
  try {
    const { autoApply } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { "profile.settings.autoApply": autoApply } },
      { new: true }
    );

    res.json({ message: "Settings updated", autoApply: user.profile.settings.autoApply });
  } catch (err) {
    res.status(500).json({ message: "Error updating settings" });
  }
});

export default router;