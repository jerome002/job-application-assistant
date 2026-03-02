import User from "../models/User.js";

// Get current profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: { profile: { ...user.profile.toObject(), email: user.email } } });
  } catch (err) {
    console.error("Get Profile Error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update full profile
export const updateFullProfile = async (req, res) => {
  try {
    const { personal, skills, experience } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { "profile.personal": personal, "profile.skills": skills, "profile.experience": experience } },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { profile: { ...updatedUser.profile.toObject(), email: updatedUser.email } },
    });
  } catch (err) {
    console.error("Update Profile Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};

// Update auto-apply setting
export const updateSettings = async (req, res) => {
  try {
    const { autoApply } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { "profile.settings.autoApply": autoApply } },
      { new: true }
    );

    res.json({ success: true, message: "Settings updated", data: { autoApply: user.profile.settings.autoApply } });
  } catch (err) {
    console.error("Update Settings Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to update settings" });
  }
};