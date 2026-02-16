import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // FIX: Include root email in the profile response
    res.json({ 
      profile: { ...user.profile.toObject(), email: user.email } 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateFullProfile = async (req, res) => {
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

    res.json({ 
      message: "Profile updated successfully", 
      profile: { ...updatedUser.profile.toObject(), email: updatedUser.email } 
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};