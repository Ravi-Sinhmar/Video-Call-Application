import { io } from "socket.io-client";
const SOCKET_SERVER_URL = "http://localhost:5000"; // Replace with your backend URL
export const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,  // Prevents auto connection, you control it manually
  transports: ["websocket"], // Ensures stable connection
});
