import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// SIGNUP
export const signup = async (req, res) => {
  try {
    //console.log("Signup request received:", req.body);
    const { email, password } = req.body;
    

    // Check if user already exists
    const existingUser = await User.findOne({ "profile.account.email": email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with initial profile structure
    const newUser = new User({
      profile: {
        personal: {
          first_name: "",
          middle_name: "",
          last_name: "",
          id_number: "",
          age: ""
        },
        account: {
          email,
          password: hashedPassword
        },
        skills: [],
        experience: []
      }
    });

    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.profile.account.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ token, profile: newUser.profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailClean = email.trim().toLowerCase();
    const user = await User.findOne({ "profile.account.email": emailClean });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.profile.account.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // JWT token
    const token = jwt.sign(
      { id: user._id, email: user.profile.account.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, profile: user.profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
