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

  socket.on('init', (request) => {
    let username = request.username;
    let color = request.color;
    if(request.username === "" || users.includes(request.username))
      username = generateUserName();
    if(request.color === "")
      color = defaultColor;
      
    users.push(username);
    colors.push(color);

    const response = {
      username: username,
      color: color,
      userList: users,
      chatLog: chatLog
    };
    socket.emit('init', response);
    socket.broadcast.emit('add-user', username);
  });

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
    if(users.includes(request.newName))
      socket.emit('display-snackbar', `The name ${request.newName} is already taken. Please try another name.`);
    else {
      changeUsername(request.newName, request.oldName);
      socket.emit('change-username', request.newName);
      io.emit('update-user-list', users);
      io.emit('update-chat-log', chatLog);
    }
  });

  socket.on('change-color', (request) => {
    const hexRegex = /[0-9A-Fa-f]{6}/g;
    if(request.color.length != 6 || !hexRegex.test(request.color)) {
      socket.emit('display-snackbar', `${request.color} is an invalid color. Please enter a valid color: RRGGBB`);
    }
    else {
      const color = `#${request.color}`;
      changeColor(request.username, color);
      socket.emit('change-color', color);
      io.emit('update-chat-log', chatLog);
    }
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
  let number = Math.floor((Math.random() * 100)); // generate a random number from 1 and 99
  let username = `User${number}`;
  while(users.includes(username)) {
    number = Math.floor((Math.random() * 100));
    username = `User${number}`;
  }
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