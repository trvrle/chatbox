let username = "";

$(function () {
    var socket = io();
    $('form').submit(function(e) {
        e.preventDefault(); // prevents page reloading
        const m = $('#m')
        if (m.val() === '') return false;
        const request = {
            username: username,
            message: m.val()
        }
        socket.emit('send-chat', request);
        m.val('');
        return false;
    });

    socket.on('init', function(response) {
        username = response.username;
        initUserList(response.userList);
        initChatLog(response.chatLog);
    });

    socket.on('self-message', function(response) {
        createSelfMessage(response)
    });

    socket.on('chat-message', function(response) {
        createChatMessage(response);
    });

    socket.on('add-user', function(response) {
        createJoinMessage(response);
        addUser(response);
    }); 
    socket.on('remove-user', function(response) {
        createLeaveMessage(response);
        removeUser(response)
    });
});

function createSelfMessage(r) {
    createMessage(r, "self")
}

function createChatMessage(r) {
    createMessage(r, "chat")
}

function createMessage(r, type) {
    $('#messages').append(
        $('<div>').addClass(`message-container message-container-${type}`).append(
            $('<div>').addClass("message").append(
                $('<div>').addClass("message-info").text(`${r.username} at ${r.timestamp}`)).append(
                $('<div>').addClass(`message-content message-content-${type}`).text(r.message)
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

function initUserList(users) {
    users.forEach(user => {
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

function initChatLog(chatLog) {
    chatLog.forEach(chatMessage => {
        if(chatMessage.username == username)
            createSelfMessage(chatMessage);
        else
            createChatMessage(chatMessage);
    });
}