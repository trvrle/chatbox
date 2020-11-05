const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('send-chat', (msg) => {
    const response = {
      message: msg,
      timestamp: getTimeStamp()
    }
    socket.broadcast.emit('chat-message', response);
    socket.emit('self-message', response);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

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