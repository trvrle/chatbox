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
        setUserList(response.userList);
    });

    socket.on('self-message', function(response) {
        createSelfMessage(response)
    });

    socket.on('chat-message', function(response) {
        console.log(response);
        createChatMessage(response);
    });

    socket.on('add-user', function(response) {
        createJoinMessage(response);
        addUser(response);
    }); 

    socket.on('join-message', function(response) {
        createJoinMessage(response);
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
                $('<div>').addClass("message-info").text(r.username + " at " + r.timestamp)).append(
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
                $('<div>').addClass("message-info").text(name + " has joined the chat")
            )
        )
    );
    updateScroll();
}

function setUserList(users) {
    users.forEach(user => {
        addUser(user)
    });
}

function addUser(name) {
    $('#user-list').append(
        $('<div>').addClass("user").text(name)
    );
}