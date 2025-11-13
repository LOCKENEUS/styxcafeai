import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8001';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect() {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      // Join customer room
      this.socket.emit('join:customer');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Socket disconnected manually');
    }
  }

  // Listen to specific events
  on(event, callback) {
    if (!this.socket) {
      console.warn('Socket not connected. Call connect() first.');
      return;
    }
    
    this.socket.on(event, callback);
    
    // Store listeners for cleanup
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (!this.socket) return;
    
    this.socket.off(event, callback);
    
    // Remove from stored listeners
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  // Emit event to server
  emit(event, data) {
    if (!this.socket) {
      console.warn('Socket not connected');
      return;
    }
    this.socket.emit(event, data);
  }
}

// Create singleton instance
const socketService = new SocketService();

// Event constants
export const SOCKET_EVENTS = {
  GAME_UPDATED: 'game:updated',
  GAME_CREATED: 'game:created',
  GAME_DELETED: 'game:deleted',
  OFFER_UPDATED: 'offer:updated',
  OFFER_CREATED: 'offer:created',
  OFFER_DELETED: 'offer:deleted',
  LOCATION_UPDATED: 'location:updated',
  LOCATION_CREATED: 'location:created',
  HERO_UPDATED: 'hero:updated',
  BOOKING_UPDATED: 'booking:updated',
  SLOT_UPDATED: 'slot:updated',
  CONTENT_UPDATED: 'content:updated',
};

export default socketService;
