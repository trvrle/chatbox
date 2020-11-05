$(function () {
    var socket = io();
    $('form').submit(function(e) {
        e.preventDefault(); // prevents page reloading
        const m = $('#m')
        if (m.val() === '') return false;
        socket.emit('send-chat', m.val());
        m.val('');
        return false;
    });

    socket.on('self-message', function(response) {
        createSelfMessage(response)
    });

    socket.on('chat-message', function(response) {
        createChatMessage(response);
    });
});

function createSelfMessage(r) {
    createMessage(r, "right")
}

function createChatMessage(r) {
    createMessage(r, "left")
}

function createMessage(r, position) {
    $('#messages')
        .append(
            $('<div>').addClass("message-container message-container-" + position)
            .append(
                $('<div>').addClass("message")
                .append(
                    $('<div>').addClass("timestamp").text(r.timestamp)
                )
                .append(
                    $('<div>').addClass("message-content message-content-" + position).text(r.message)
                )
            )
        );
}