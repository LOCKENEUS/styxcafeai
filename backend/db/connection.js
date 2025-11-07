const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  console.error("DB_URL is not defined in the .env file.");
  process.exit(1);
}

// Function to connect to MongoDB with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to the database successfully!");
  } catch (err) {
    console.error("Failed to connect to the database:", err.message);
    console.log("Retrying connection in 2 seconds...");
    setTimeout(connectWithRetry, 2000); // Retry after 2 seconds
  }
};

// Initial connection
connectWithRetry();

// Event listeners for connection status
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from DB");
  console.log("Attempting to reconnect...");
  setTimeout(connectWithRetry, 2000); // Retry on disconnection
});

// Remove SIGINT handler here to avoid duplication

// Export a clean disconnect function for graceful shutdown
const disconnect = async () => {
  try {
    await mongoose.connection.close();
    console.log("Mongoose connection closed.");
  } catch (err) {
    console.error("Error while disconnecting Mongoose:", err);
  }
};

module.exports = { disconnect };