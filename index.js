const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 5000;

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on("change_location", (data) => {
    socket.broadcast.emit("change_location", data);
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
