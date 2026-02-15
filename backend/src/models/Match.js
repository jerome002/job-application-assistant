import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  score: { type: Number, required: true }, // The % match
  status: { 
    type: String, 
    enum: ['pending', 'applied', 'rejected', 'saved'], 
    default: 'pending' 
  }
}, { timestamps: true });

// One user can't match the same job twice
matchSchema.index({ user: 1, job: 1 }, { unique: true });

export default mongoose.model("Match", matchSchema);