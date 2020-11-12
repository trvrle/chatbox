const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let users = [];
let clients = [];
let chatLog = [];

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  clients.push(socket);
  const username = generateUserName();
  const initResponse = {
    username: username,
    userList: users,
    chatLog: chatLog
  }
  socket.emit('init', initResponse);
  socket.broadcast.emit('add-user', username);

  socket.on('send-chat', (request) => {
    const messageResponse = {
      username: request.username,
      message: request.message,
      timestamp: getTimeStamp()
    }
    saveMessage(messageResponse);
    socket.broadcast.emit('chat-message', messageResponse);
    socket.emit('self-message', messageResponse);
  });

  socket.on('disconnect', function() {
    const i = clients.indexOf(socket);
    clients.splice(i, 1);
    socket.broadcast.emit('remove-user', users.splice(i, 1)[0]);
  });
});

http.listen(3000, () => {
  console.log('listening on port 3000');
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

function saveMessage(chat) {
  chatLog.push(chat);
  if(chatLog.length > 200) 
    chatLog.shift()
}