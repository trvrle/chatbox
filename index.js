const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let users = [];
let colors = [];
let clients = [];
let chatLog = [];

const defaultColor = "#cccccc";

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  clients.push(socket);
  const username = generateUserName();
  const initResponse = {
    username: username,
    color: defaultColor,
    userList: users,
    chatLog: chatLog
  }
  socket.emit('init', initResponse);
  socket.broadcast.emit('add-user', username);

  socket.on('send-chat', (request) => {
    const messageResponse = {
      username: request.username,
      color: request.color,
      timestamp: getTimeStamp(),
      text: request.text
    }
    saveMessage(messageResponse);
    socket.broadcast.emit('chat-message', messageResponse);
    socket.emit('self-message', messageResponse);
  });

  socket.on('change-username', (request) => {
    changeUsername(request.newName, request.oldName);
    socket.emit('change-username', request.newName);
    io.emit('update-user-list', users);
    io.emit('update-chat-log', chatLog);
  });

  socket.on('change-color', (request) => {
    changeColor(request.username, request.color);
    socket.emit('change-color', request.color);
    io.emit('update-chat-log', chatLog);
  });

  socket.on('disconnect', function() {
    const i = clients.indexOf(socket);
    clients.splice(i, 1);
    colors.splice(i, 1);
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

function changeUsername(newName, oldName) {
  let index = users.indexOf(oldName);
  if (~index) {
    users[index] = newName;
    chatLog.forEach(chatMessage => {
      if (chatMessage.username === oldName)
        chatMessage.username = newName;
    });
  }
}

function changeColor(username, color) {
  let index = users.indexOf(username);
  if(~index) {
    colors[index] = color;
    chatLog.forEach(chatMessage => {
      if (chatMessage.username === username)
        chatMessage.color = color;
    });
  }
}