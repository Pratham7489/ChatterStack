import http from 'http'
import { Server } from 'socket.io'
import express from 'express'
import jwt from "jsonwebtoken"
import { Socket } from 'dgram';

const app = express();
const server = http.createServer(app);

// Allowed origins (local + production)
const allowedOrigins = [
  "http://localhost:5173",
  "https://chatter-stack.vercel.app",
  "https://chatterstack-production.up.railway.app",
];

const io = new Server(server , {
    cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("Blocked socket origin:", origin);
        callback(new Error("CORS not allowed for this origin: " + origin));
      }
    },
    credentials: true,
  },     
});

// Store online users
const onlineUsers = new Map();

export const getRecieverSocketId = (userId) => {
    return onlineUsers.get(userId?.toString());
};

io.on('connection', (socket) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      console.log("Socket rejected: No token");
      socket.disconnect();
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id.toString();

    onlineUsers.set(userId, socket.id);
    console.log("User connected:", userId, socket.id);

    io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      console.log("User disconnected:", userId);

      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    });

  } catch (error) {
    console.log("Socket auth failed:", error.message);
    socket.disconnect();
  }  
});

export { app, io, server, onlineUsers };