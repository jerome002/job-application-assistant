// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  profile: {
    personal: {
      first_name: { type: String, default: "" },
      middle_name: { type: String, default: "" },
      last_name: { type: String, default: "" },
      id_number: { type: String, default: "" },
      age: { type: String, default: "" }
    },
    account: {
      email: { type: String, required: true, unique: true, lowercase: true },
      password: { type: String, required: true }
    },
    skills: { type: [String], default: [] },
    experience: {
      type: [
        {
          company: { type: String, default: "" },
          role: { type: String, default: "" },
          years: { type: String, default: "" }
        }
      ],
      default: []
    }
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
