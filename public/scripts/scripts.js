let username = "";

$(function () {
    var socket = io();
    $('form').submit(function(e) {
        e.preventDefault(); // prevents page reloading
        const m = $('#m')
        if (m.val() === '') return false;
        if (m.val().startsWith("/name")) {
            const newName = m.val().split(" ")[1];
            m.val('');
            const request = {
                newName: newName,
                oldName: username
            }
            socket.emit('change-username', request);
            return false;
        }
        const request = {
            username: username,
            text: m.val()
        }
        socket.emit('send-chat', request);
        m.val('');
        return false;
    });

    socket.on('init', function(response) {
        username = response.username;
        initChatLog(response.chatLog);
        initUserList(response.userList);
    });

    socket.on('self-message', function(response) {
        createSelfMessage(response.username, response.timestamp, response.text);
    });

    socket.on('chat-message', function(response) {
        createChatMessage(response.username, response.timestamp, response.text);
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

    socket.on('update-user-list', function(userList) {
        updateUserList(userList);
    });
});

function createSelfMessage(name, timestamp, text) {
    createMessage(name, timestamp, text, "self")
}

function createChatMessage(name, timestamp, text) {
    createMessage(name, timestamp, text, "chat")
}

function createMessage(name, timestamp, text, type) {
    $('#messages').append(
        $('<div>').addClass(`message-container message-container-${type}`).append(
            $('<div>').addClass("message").append(
                $('<div>').addClass("message-info").text(`${name} at ${timestamp}`)).append(
                $('<div>').addClass(`message-content message-content-${type}`).text(text)
            )
        )
    );
    updateScroll();
}

function updateScroll() {
    let messages = document.getElementById("messages");
    messages.scrollTop = messages.scrollHeight;
}

function createJoinMessage(name) {
    $('#messages').append(
        $('<div>').addClass("message-container message-container-chat").append(
            $('<div>').addClass("message").append(
                $('<div>').addClass("message-info").text(`${name} has joined the chat`)
            )
        )
    );
    updateScroll();
}

function createLeaveMessage(name) {
    $('#messages').append(
        $('<div>').addClass("message-container message-container-chat").append(
            $('<div>').addClass("message").append(
                $('<div>').addClass("message-info").text(`${name} has left the chat`)
            )
        )
    );
    updateScroll();
}

function initChatLog(chatLog) {
    chatLog.forEach(chatMessage => {
        if(chatMessage.username == username)
            createSelfMessage(chatMessage.username, chatMessage.timestamp, chatMessage.text);
        else
            createChatMessage(chatMessage.username, chatMessage.timestamp, chatMessage.text);
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