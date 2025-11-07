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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',  // Customer Website (PRIMARY)
  'http://localhost:3001',  // Admin Panel (SECONDARY)
  'http://localhost:3002',  // Sporty Frontend
  'http://localhost:5173',
  'http://localhost:8001',
  'https://cafe-auth-fix.preview.emergentagent.com',
  'https://styxuser.lockene.co',
  'https://your-production-domain.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // In production, only allow specific origins
    if (process.env.NODE_ENV === 'production') {
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    }
    
    // In development, allow all origins
    return callback(null, true);
  },
  credentials: true
};

app.use(cors(corsOptions));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

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