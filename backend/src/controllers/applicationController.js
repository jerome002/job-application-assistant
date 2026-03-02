import Application from "../models/Application.js";

export const getMyApplications = async (req, res) => {
  try {
    // req.user.id comes from your verified verifyToken middleware
    const apps = await Application.find({ user: req.user.id })
      .populate("job")
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      applications: apps 
    });
  } catch (err) {
    console.error("GET_APPS_ERROR:", err);
    res.status(500).json({ success: false, message: "Server error fetching applications" });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const { jobId, notes } = req.body;
    const newApp = await Application.create({
      user: req.user.id,
      job: jobId,
      status: "applied",
      notes: notes || "",
      appliedDate: new Date(),
    });
    res.status(201).json({ success: true, application: newApp });
  } catch (err) {
    res.status(500).json({ success: false, message: "Database error during application" });
  }
};