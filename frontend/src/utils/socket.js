import { io } from "socket.io-client";

// Professional environment fallback logic
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"], 
  reconnection: true,
  reconnectionAttempts: 10, // Increased for better production stability
  reconnectionDelay: 2000,
  withCredentials: true,    // Ensures CORS cookies/headers pass through
});

/**
 * Join user's private room for real-time AI match alerts
 */
export const joinUserRoom = (userId) => {
  if (userId && socket.connected) {
    socket.emit("join_room", userId);
    console.log(`Socket: Joined Room [${userId}]`);
  }
};

/**
 * Robust connect function with auto-rejoin logic
 */
export const connectSocket = (userId) => {
  if (!userId) return;

  if (!socket.connected) {
    socket.connect();

    // CRITICAL: Re-join room on every connect/reconnect event
    socket.on("connect", () => {
      console.log("Socket: Connected", socket.id);
      joinUserRoom(userId);
    });

    // Handle reconnection specifically
    socket.on("reconnect", () => {
      console.log("Socket: Reconnected");
      joinUserRoom(userId);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket: Connection Error", err.message);
    });
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    // Remove listeners to prevent memory leaks in React
    socket.off("connect");
    socket.off("reconnect");
    socket.disconnect();
    console.log("Socket: Disconnected");
  }
};