$(function () {
    var socket = io();
    $('form').submit(function(e) {
        e.preventDefault(); // prevents page reloading
        const message = $('#m').val()
        $('#messages')
            .append($('<div></div>').addClass("message-container").addClass("message-container-self")
            .append($('<div></div>').addClass("message").addClass("message-self").text(message)));
        socket.emit('chat-message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat-message', function(msg){
        $('#messages')
            .append($('<div></div>').addClass("message-container").css("flex-direction", "row")
            .append($('<div></div>').addClass("message").css("border-radius", "12px 12px 12px 3px").text(msg)));
    });
});