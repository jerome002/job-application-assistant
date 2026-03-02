import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { email, password, personal } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      profile: { personal },
    });

    // Sign JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || "dev_secret_key", { expiresIn: "7d" });

    res.status(201).json({ token, profile: newUser.profile });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Error signing up" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Sign JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "dev_secret_key", { expiresIn: "7d" });

    res.json({ token, profile: user.profile });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
};