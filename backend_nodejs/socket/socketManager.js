const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://cafe-admin-panel.preview.emergentagent.com",
        "https://styxcafe-revamp.preview.emergentagent.com",
        "https://cc1406e7-8328-4a1b-a2a0-928d2f749a14.preview.emergentagent.com"
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.on("connection", (socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });

    // Join specific rooms based on user type
    socket.on("join:admin", () => {
      socket.join("admin-room");
      console.log(`Admin joined: ${socket.id}`);
    });

    socket.on("join:customer", () => {
      socket.join("customer-room");
      console.log(`Customer joined: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// Emit events to all connected clients
const emitToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
    console.log(`📡 Emitted ${event} to all clients`);
  }
};

// Emit to specific rooms
const emitToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
    console.log(`📡 Emitted ${event} to room: ${room}`);
  }
};

// Emit to customer website only
const emitToCustomers = (event, data) => {
  emitToRoom("customer-room", event, data);
};

// Event names for real-time updates
const EVENTS = {
  GAME_UPDATED: "game:updated",
  GAME_CREATED: "game:created",
  GAME_DELETED: "game:deleted",
  OFFER_UPDATED: "offer:updated",
  OFFER_CREATED: "offer:created",
  OFFER_DELETED: "offer:deleted",
  LOCATION_UPDATED: "location:updated",
  LOCATION_CREATED: "location:created",
  HERO_UPDATED: "hero:updated",
  BOOKING_UPDATED: "booking:updated",
  SLOT_UPDATED: "slot:updated",
  CONTENT_UPDATED: "content:updated",
};

module.exports = {
  initializeSocket,
  getIO,
  emitToAll,
  emitToRoom,
  emitToCustomers,
  EVENTS
};
