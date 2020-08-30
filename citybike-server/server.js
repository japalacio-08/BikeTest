const getApiAndEmit = require("./api/bikeApi.js")
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");



const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();


app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
let interval;

io.on("connection", socket => {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;

  console.log('New connection ' + socketId + ' from ' + clientIp);
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 300);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});



server.listen(port, () => console.log(`Listening on port ${port}`));



