import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  personal: {
    first_name: { type: String, default: "" },
    middle_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    phone: { type: String, default: "" }, // ADDED PHONE
    location: { type: String, default: "" } // ENSURED LOCATION
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
    autoApply: { type: Boolean, default: false }
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  profile: { 
    type: profileSchema, 
    default: () => ({}) 
  }
}, { timestamps: true });

userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

export default mongoose.model("User", userSchema);