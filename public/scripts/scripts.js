let username = "";
let color = "";

$(function () {
    var socket = io();
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
            const color = m.val().split(" ")[1];
            m.val('')
            const request = {
                name: username,
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
        initChatLog(response.chatLog);
        initUserList(response.userList);
    });

    socket.on('self-message', function(response) {
        createSelfMessage(response.username, response.color, response.timestamp, response.text);
    });

    socket.on('chat-message', function(response) {
        createChatMessage(response.username, response.color, response.timestamp, response.text);
    });

    socket.on('add-user', function(response) {
        createJoinMessage(response);
        addUser(response);
    }); 

    socket.on('remove-user', function(response) {
        createLeaveMessage(response);
        removeUser(response)
    });

    socket.on('change-username', function(newUsername) {
        username = newUsername;
    });

    socket.on('change-color', function(newColor) {

    });

    socket.on('update-user-list', function(userList) {
        updateUserList(userList);
    });
});

function createSelfMessage(name, color, timestamp, text) {
    createMessage(name, color, timestamp, text, "self")
}

function createChatMessage(name, color, timestamp, text) {
    createMessage(name, color, timestamp, text, "chat")
}

function createMessage(name, color, timestamp, text, type) {
    $('#messages').append(
        $('<div>').addClass(`message-container message-container-${type}`).append(
            $('<div>').addClass("message").append(
                $('<div>').addClass("message-info").text(`${name} at ${timestamp}`).css("color", color)).append(
                $('<div>').addClass(`message-content message-content-${type}`).text(text)
            )
        )
    );
    updateScroll();
}

function createJoinMessage(name) {
    createInfoMessage(name, "joined");
}

function createLeaveMessage(name) {
    createInfoMessage(name, "left")
}

function createInfoMessage(name, type) {
    $('#messages').append(
        $('<div>').addClass("message-container message-container-chat").append(
            $('<div>').addClass("message").append(
                $('<div>').addClass("message-info").text(`${name} has ${type} the chat`)
            )
        )
    );
    updateScroll();
}

function updateScroll() {
    let messages = document.getElementById("messages");
    messages.scrollTop = messages.scrollHeight;
}

function initChatLog(chatLog) {
    chatLog.forEach(chatMessage => {
        if(chatMessage.username == username)
            createSelfMessage(chatMessage.username, chatMessage.color, chatMessage.timestamp, chatMessage.text);
        else
            createChatMessage(chatMessage.username, chatMessage.color, chatMessage.timestamp, chatMessage.text);
    });
}

function initUserList(userList) {
    userList.forEach(user => {
        if(user === username)
            addUser(user + " (you)");
        else
            addUser(user)
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

function updateUserList(userList) {
    clearUserList();
    initUserList(userList);
}

function clearUserList() {
    $('#user-list').empty();
}