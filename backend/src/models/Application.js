import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  // Changed from userId to user to match your Match model style
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Changed from jobId to job
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { type: String, default: 'applied' },
  appliedDate: { type: Date, default: Date.now },
  // Added notes so we can label it as "AI Applied"
  notes: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model('Application', ApplicationSchema);