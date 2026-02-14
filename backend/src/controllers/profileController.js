import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Get user profile
export const getProfile = async (req, res) => {
  try {
    res.json({ profile: req.user.profile });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Personal Info
export const updatePersonal = async (req, res) => {
  try {
    const { personal } = req.body;
    if (!personal) return res.status(400).json({ message: "Personal data required" });
    req.user.profile.personal = personal;
    await req.user.save();
    res.json({ profile: req.user.profile });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Skills (The Sync Method)
export const updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills)) return res.status(400).json({ message: "Skills must be an array" });
    req.user.profile.skills = skills;
    await req.user.save();
    res.json({ message: "Skills updated", skills: req.user.profile.skills });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Experience (The Sync Method)
export const updateExperience = async (req, res) => {
  try {
    const { experience } = req.body;
    if (!Array.isArray(experience)) return res.status(400).json({ message: "Experience must be an array" });
    req.user.profile.experience = experience;
    await req.user.save();
    res.json({ message: "Experience updated", experience: req.user.profile.experience });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
export const updateFullProfile = async (req, res) => {
  try {
    const { profile } = req.body;

    // Use a specific update object to avoid hitting the 'unique' email constraint incorrectly
    const updateData = {
      $set: {
        "profile.personal": profile.personal,
        "profile.skills": profile.skills,
        "profile.experience": profile.experience,
        // We often omit updating 'account' here because email/password 
        // are usually handled by a separate Auth route
      },
      isComplete: true 
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ profile: updatedUser.profile });
  } catch (err) {
    // This will print the EXACT error to your terminal
    console.error("Mongoose Error:", err.code === 11000 ? "Duplicate Email" : err.message);
    
    res.status(500).json({ 
      message: "Server Error", 
      error: err.message,
      code: err.code // Will show 11000 if it's an email conflict
    });
  }
};