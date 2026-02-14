
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  personal: {
    first_name: { type: String, default: "" },
    middle_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    age: { type: String, default: "" } 
  },
  account: {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true }, 
    password: { type: String, required: true }
  },
  skills: { type: [String], default: [] },
  experience: [
    {
      company: { type: String, default: "" },
      role: { type: String, default: "" },
      years: { type: String, default: "" }
    }
  ]
}, { _id: false });

const userSchema = new mongoose.Schema({
  profile: { type: profileSchema, default: () => ({}) }
}, { timestamps: true });

// ✅ We removed the .pre('save') block that was causing the crash.

export default mongoose.model("User", userSchema);