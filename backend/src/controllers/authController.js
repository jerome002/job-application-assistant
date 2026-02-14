import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input exists
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Check for existing user using the nested path
    const existingUser = await User.findOne({ "profile.account.email": email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User - EXACT match to your Model
    const newUser = new User({
      profile: {
        personal: { first_name: "", middle_name: "", last_name: "", age: "" },
        account: { email, password: hashedPassword },
        skills: [],
        experience: []
      }
    });

    await newUser.save();

    // 5. Generate Token (Fallback to 'dev_secret' if .env is missing)
    const secret = process.env.JWT_SECRET || "dev_secret_key_123";
    const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: "1d" });

    // 6. Return response
    res.status(201).json({
      token,
      profile: {
        personal: newUser.profile.personal,
        account: { email: newUser.profile.account.email },
        skills: newUser.profile.skills,
        experience: newUser.profile.experience
      }
    });

  } catch (err) {
    // This will print the EXACT error in your server terminal
    console.error("CRITICAL SIGNUP ERROR:", err); 
    res.status(500).json({ message: "Server error during registration", error: err.message });
  }
};
// ✅ LOGIN CONTROLLER (This was likely missing or not exported!)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Look for the user by the nested email path
    const user = await User.findOne({ "profile.account.email": email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.profile.account.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });

    // Send back the profile data (without the password)
    res.json({
      token,
      profile: {
        personal: user.profile.personal,
        account: { email: user.profile.account.email },
        skills: user.profile.skills,
        experience: user.profile.experience
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};