import Application from '../models/Application.js';

export const autoApply = async (userId, jobId) => {
  try {
    // Check if they've already applied to this job
    const existingApp = await Application.findOne({ user: userId, job: jobId });
    if (existingApp) return;

    const newApplication = new Application({
      user: userId,
      job: jobId,
      status: 'applied', // Automatically set to applied
      appliedDate: new Date(),
      notes: "Applied automatically by AI Assistant based on high match score."
    });

    await newApplication.save();
    console.log(`🤖 Auto-Applied: User ${userId} to Job ${jobId}`);
    return newApplication;
  } catch (err) {
    console.error("Auto-Apply Error:", err.message);
  }
};