const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

function init() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server);

  app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
  });

  // Handle new connections
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Listen for chat messages
    socket.on("chat message", (msg) => {
      console.log("message: " + msg);
      socket.broadcast.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

    socket.on("error", (err) => {
      console.log("An error occurred", err);
    });
  });

  server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
}

init();
