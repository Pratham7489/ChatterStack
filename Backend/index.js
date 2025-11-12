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

const allowedOrigins = [
  process.env.CLIENT_URL,        // This should be https://chatter-stack.vercel.app
  "https://chatterstack-production.up.railway.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));



// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Routers
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

server.listen(port, () => {
  connectDB();
  console.log(`app listening on port ${port}`);
});
