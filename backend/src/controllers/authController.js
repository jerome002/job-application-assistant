import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jobhuntkey";

export const signup = async (req, res) => {
  try {
    const { email, password, personal } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      profile: {
        personal: personal || { first_name: "", last_name: "", age: "" },
        skills: [],
        experience: []
      }
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1d" });

    // FIX: Send email inside the profile object
    res.status(201).json({
      token,
      userId: newUser._id,
      profile: { ...newUser.profile.toObject(), email: newUser.email }
    });
  } catch (err) {
    console.error("CRITICAL SIGNUP ERROR:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    // FIX: Inject root email into profile for frontend convenience
    res.json({
      token,
      userId: user._id,
      profile: { ...user.profile.toObject(), email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
};