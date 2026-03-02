import { io } from "socket.io-client";

//  Use Vite env or fallback to localhost
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

// Initialize Socket.io client
export const socket = io(SOCKET_URL, {
  autoConnect: false,   // we manually connect when user info is ready
  transports: ["websocket"], // force websocket only (optional)
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Join user's private room for real-time matches
export const joinUserRoom = (userId) => {
  if (userId && socket.connected) {
    socket.emit("join_room", userId);
    console.log(`👤 Joined Socket Room: ${userId}`);
  }
};

// Safe connect function
export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      joinUserRoom(userId);
    });
  }
};

// Safe disconnect function
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
};