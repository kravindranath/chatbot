//index.js
const express = require("express");
const socketIo = require("socket.io");
const cors = require("cors");
const http = require("http");
const app = express();
const port = 8080;

// Enable CORS
app.use(cors());

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Change this to your frontend URL
    methods: ["GET", "POST"],
  },
});

// open chat connect first time
// data will have a room and message to create a closed space
// to exchange messages

io.on("connection", (socket) => {
  //new client connection established
  console.log("New client connected, connect id: ", socket.id);

  socket.on("joinRoom", (data) => {
    socket.join(data);
  });

  socket.on("sendMessage", (data) => {
    socket.to(data.room).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.get("/", (req, res) => {
  res.send(`Hello!, from Server`);
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
