import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

// Import Services
import initCrons from "./services/cronManager.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// 1. Create HTTP Server
const server = http.createServer(app);

// 2. Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // Support Vite and CRA defaults
    methods: ["GET", "POST", "PUT"],
  },
});

// --- Middleware ---
app.use(cors()); // Standardize this with your Socket CORS later for production
app.use(express.json());

// 3. Attach Socket.io to Request (Allows triggers inside Controllers)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/matches", matchRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.get("/", (req, res) => {
  res.send("Job Application Assistant API is running smoothly.");
});

// 4. Socket.io Connection Logic
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join_room", (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`👤 User ${userId} joined their private match room`);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected");
  });
});

// --- Database Connection & Server Start ---
if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in .env file.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("📦 MongoDB connected successfully");

    // 5. Initialize Crons (The Matching Engine)
    initCrons(io);

    // 6. Use 'server.listen' for both Express and Socket.io
    server.listen(PORT, () =>
      console.log(`🚀 Server & Real-time Engine running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Server Initialization Error:", err.message);
    process.exit(1);
  });