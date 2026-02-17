import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  personal: {
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" }
  },
  skills: { type: [String], default: [] },
  experience: [
    {
      company: { type: String, default: "" },
      role: { type: String, default: "" },
      years: { type: String, default: "" }
    }
  ],
  settings: {
    autoApply: { type: Boolean, default: false } // THE ROBOT SWITCH
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  profile: { type: profileSchema, default: () => ({}) }
}, { timestamps: true });

// Remove password from JSON responses automatically
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

export default mongoose.model("User", userSchema);