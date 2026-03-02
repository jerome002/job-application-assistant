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

// Validation for critical variables
if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env");
  process.exit(1);
}

// 1. DYNAMIC CORS: Handles Local, Production, and Vercel Preview URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://job-application-assistant-seven.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // Check if origin matches allowed list OR is a Vercel subdomain
    const isAllowed = allowedOrigins.includes(origin);
    const isVercelPreview = origin.endsWith(".vercel.app");

    if (isAllowed || isVercelPreview) {
      callback(null, true);
    } else {
      console.error(`CORS Blocked for origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

// 2. HTTP & Socket.io Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions 
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
    
    // Initialize Cron Jobs
    initCrons(io);

    server.listen(PORT, () => {
      console.log(`Server: Live on port ${PORT}`);
      console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
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