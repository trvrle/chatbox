let username = "";
let color = "";
const cookieHelper = new CookieHelper();
const messageHelper = new MessageHelper();

$(function () {
    var socket = io();
    socket.emit('init', {
        username: cookieHelper.getCookieValue("username"),
        color: cookieHelper.getCookieValue("color")
    });

    $('form').submit(function(e) {
        e.preventDefault(); // prevents page reloading
        const m = $('#m')
        if (m.val() === '') 
            return false;
        else if (m.val().startsWith("/name ")) {
            const newName = m.val().split(" ")[1];
            m.val('');
            const request = {
                newName: newName,
                oldName: username
            }
            socket.emit('change-username', request);
            return false;
        }
        else if (m.val().startsWith("/color ")) {
            const color = "#" + m.val().split(" ")[1];
            m.val('')
            const request = {
                username: username,
                color: color
            }
            socket.emit('change-color', request);
            return false;
        }
        const request = {
            username: username,
            color: color,
            text: m.val()
        }
        socket.emit('send-chat', request);
        m.val('');
        return false;
    });

    socket.on('init', function(response) {
        username = response.username;
        color = response.color;
        updateChatLog(response.chatLog);
        updateUserList(response.userList);
        cookieHelper.saveCookie("username", response.username);
        cookieHelper.saveCookie("color", response.color);
    });

    socket.on('self-message', function(response) {
        messageHelper.createSelfMessage(response.username, response.color, response.timestamp, response.text);
    });

    socket.on('chat-message', function(response) {
        messageHelper.createChatMessage(response.username, response.color, response.timestamp, response.text);
    });

    socket.on('add-user', function(response) {
        messageHelper.createJoinMessage(response);
        addUser(response);
    }); 

    socket.on('remove-user', function(response) {
        messageHelper.createLeaveMessage(response);
        removeUser(response);
    });

    socket.on('change-username', function(newUsername) {
        username = newUsername;
        cookieHelper.saveCookie("username", newUsername);
    });

    socket.on('change-color', function(newColor) {
        color = newColor;
        cookieHelper.saveCookie("color", newColor);
    });

    socket.on('update-user-list', function(userList) {
        updateUserList(userList);
    });

    socket.on('update-chat-log', function(response) {
        updateChatLog(response);
    });
});

function updateChatLog(chatLog) {
    clearMessages();
    chatLog.forEach(chatMessage => {
        if(chatMessage.username === username)
            messageHelper.createSelfMessage(chatMessage.username, chatMessage.color, chatMessage.timestamp, chatMessage.text);
        else
            messageHelper.createChatMessage(chatMessage.username, chatMessage.color, chatMessage.timestamp, chatMessage.text);
    });
}

function updateUserList(userList) {
    clearUserList();
    userList.forEach(user => {
        if(user === username)
            addUser(user + " (you)");
        else
            addUser(user);
    });
}

function addUser(name) {
    $('#user-list').append(
        $('<div>').attr('id', name).addClass("user").text(name)
    );
}

function removeUser(name) {
    $(`#${name}`).remove();
}

function clearUserList() {
    $('#user-list').empty();
}

function clearMessages() {
    $('#messages').empty();
}