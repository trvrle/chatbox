const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let users = [];

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  const username = generateUserName();
  socket.broadcast.emit('join-message', username);
  socket.emit('set-username', username);

  socket.on('send-chat', (request) => {
    const response = {
      username: request.username,
      message: request.message,
      timestamp: getTimeStamp()
    }
    socket.broadcast.emit('chat-message', response);
    socket.emit('self-message', response);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

function generateUserName() {
  const username = "User" + (users.length + 1)
  users.push(username);
  return username;
}

function getTimeStamp() {
  const date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours < 12 ? "AM" : "PM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return hours + ":" + minutes + ampm;
}