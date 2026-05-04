require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { WebSocketServer } = require("ws");
const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const mentorshipRoutes = require("./routes/mentorshipRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { seedDemo } = require("./seed");
const { registerWsClient, removeWsClient } = require("./ws/manager");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/messages", messageRoutes);

app.get("/api/", (_, res) => res.json({ service: "alumni-network", status: "ok" }));

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const match = url.pathname.match(/^\/api\/ws\/([^/]+)$/);
  if (!match) return socket.destroy();
  const userId = match[1];
  const token = url.searchParams.get("token");
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.sub !== userId) return socket.destroy();
  } catch (_) {
    return socket.destroy();
  }
  wss.handleUpgrade(req, socket, head, (ws) => {
    registerWsClient(userId, ws);
    ws.on("close", () => removeWsClient(userId, ws));
  });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("MongoDB connected");
    await seedDemo();
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error("Mongo connection error:", err));
