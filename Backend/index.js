import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import connectDB from "./config/conn.js";
import { server, app } from "./config/socket.js";

const port = process.env.PORT || 3232;

// Allow only frontend and backend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://chatter-stack.vercel.app",
  "https://chatterstack-production.up.railway.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin: " + origin));
    }
  },
  credentials: true,
};

// Apply CORS middleware before routes
app.use(cors(corsOptions));

// Parse cookies and JSON
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// Default route
app.get("/", (req, res) => {
  res.send("ChatterStack backend is running!");
});

// API routes
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

// Start server
server.listen(port, () => {
  connectDB();
  console.log(`🚀 Server listening on port ${port}`);
});
