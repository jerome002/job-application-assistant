import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

// Routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

// Services
import initCrons from "./services/cronManager.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env");
  process.exit(1);
}

// 1. IMPROVED CORS: Allow multiple origins (Local + Production)
const allowedOrigins = [
  "http://localhost:5173",
  "https://job-application-assistant-seven.vercel.app" // Your Vercel URL
];

// Check if a specific FRONTEND_URL is set in environment variables
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}


const corsOptions = {
  origin: function (origin, callback) {
    // 1. Allow internal requests (no origin)
    if (!origin) return callback(null, true);

    // 2. Exact match check
    const isAllowed = allowedOrigins.some((o) => origin.startsWith(o));

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`CORS Blocked for origin: ${origin}`); // Log this to Render logs
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"] // Explicitly allow these
};

app.use(cors(corsOptions));
app.use(express.json());

// 2. HTTP & Socket.io Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions // Sync Socket.io CORS with Express CORS
});

// Middleware to inject IO into controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 3. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/applications", applicationRoutes);

// Root Health Check
app.get("/health", (req, res) => res.status(200).json({ status: "UP", timestamp: new Date() }));
app.get("/", (req, res) => res.json({ success: true, message: "JobSync AI API Online" }));

// 4. Socket Events
io.on("connection", (socket) => {
  socket.on("join_room", (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`Socket: User ${userId} joined room`);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔌 Socket: Client disconnected");
  });
});

// 5. Database & Server Initiation
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Database: MongoDB Connected Successfully");
    initCrons(io);
    server.listen(PORT, () => {
      console.log(`Server: Live on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database: Connection Error ->", err.message);
    process.exit(1);
  });

// 6. Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing server gracefully...");
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log("Server and DB connections closed.");
      process.exit(0);
    });
  });
});