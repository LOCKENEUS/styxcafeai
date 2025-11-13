const express = require("express");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const superAdminRouter = require("./component/superadmin/index");
const adminRouter = require("./component/admin/index");
const userRouter = require("./component/user/index");
const authRouter = require("./component/auth/router/router");
const aiRouter = require("./component/ai/router");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./db/connection");
const PORT = process.env.PORT || 8001;

// Trust proxy for rate limiting in production
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  // Local development URLs
  'http://localhost:3000',  // Admin Panel / Customer Website
  'http://localhost:3001',  // Secondary Frontend
  'http://localhost:3002',  // Sporty Frontend
  'http://localhost:5173',  // Vite Dev Server
  'http://localhost:8001',  // Backend Self
  // Environment-based production URLs (set by Emergent)
  process.env.CLIENT_URL,   // Production frontend URL
  process.env.ADMIN_URL,    // Production admin URL
  // Preview and production domains
  'https://cafe-backend.preview.emergentagent.com',
  'https://cafe-admin-panel.preview.emergentagent.com',
  'https://styxcafe-revamp.preview.emergentagent.com',
  'https://styxuser.lockene.co',
  'https://cc1406e7-8328-4a1b-a2a0-928d2f749a14.preview.emergentagent.com'
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow all Emergent preview/production domains
    if (origin && origin.includes('.emergentagent.com')) {
      return callback(null, true);
    }
    
    // In production, enforce strict CORS
    if (process.env.NODE_ENV === 'production') {
      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
    
    // In development, allow all origins
    console.log(`CORS allowed origin (dev mode): ${origin}`);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight requests for 10 minutes
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Serve static files - both paths for compatibility
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Welcome to the Styx Cafe!");
});

app.use("/api/superadmin", superAdminRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/ai", aiRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// Initialize Socket.io
const { initializeSocket } = require("./socket/socketManager");
initializeSocket(server);
console.log("✅ Socket.io initialized successfully");

// Place graceful shutdown signals below
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Graceful shutdown
  shutdownServer(reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  shutdownServer(err);
});

function shutdownServer(error) {
  console.log("Shutting down server gracefully due to unhandled rejection...");

  // Stop accepting new connections
  server.close(() => {
    console.log("Closed out remaining connections.");
    process.exit(1);
  });

  // Force shutdown if connections hang
  setTimeout(() => {
    console.error("Forcing shutdown due to hanging connections.");
    process.exit(1);
  }, 10000);
}

async function gracefulShutdown() {
  console.log("Shutting down gracefully...");

  try {
    // Stop accepting new connections
    server.close(async () => {
      console.log("Closed out remaining connections.");

      // Disconnect from DB
      try {
        await db.disconnect(); // adjust based on your db connector
        console.log("Database disconnected.");
      } catch (err) {
        console.error("Error during DB disconnect:", err);
      }

      process.exit(0);
    });

    // Force exit if connections hang
    setTimeout(() => {
      console.error("Forcing shutdown due to hanging connections.");
      process.exit(1);
    }, 10000);

  } catch (err) {
    console.error("Error during graceful shutdown:", err);
    process.exit(1);
  }
}

module.exports = app;