import http from 'http'
import { Server } from 'socket.io'
import express from 'express'

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
    console.log("User connected:", socket.id);

    // Store user when they connect
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
        onlineUsers.set(userId, socket.id);
        console.log("User registered:", userId, "Socket:", socket.id);

        // Emit updated online users to all clients
        io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
    }

    //  Handle disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
   
       
        // Remove user from online users
        if (userId && userId !== "undefined") {
            onlineUsers.delete(userId);
            console.log("User removed:", userId);

            // Emit updated online users to all clients
            io.emit('getOnlineUsers', Array.from(onlineUsers.keys()));
        }
    });    
});

export { app, io, server, onlineUsers };