const BACKEND_URL =
import.meta.env.VITE_ENV === "Production"
  ? import.meta.env.VITE_PRODUCTION_BACKEND_URL
  : import.meta.env.VITE_LOCAL_BACKEND_URL;


import { io } from "socket.io-client";
const SOCKET_SERVER_URL = BACKEND_URL; // Replace with your backend URL
export const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,  // Prevents auto connection, you control it manually
  transports: ["websocket"], // Ensures stable connection
});
