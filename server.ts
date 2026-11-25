import express, { Request, Response } from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import {
  ChatMessage,
  ClientToServerEvents,
  ServerToClientEvents,
} from "./types";

const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);

const PORT = process.env.PORT || 5500;

app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), "public/index.html"));
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send message", (msg: string) => {
    const cleanMsg = msg.trim();
    if (!cleanMsg) return;

    const payload: ChatMessage = {
      msg: cleanMsg,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    io.emit("new message", payload);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});