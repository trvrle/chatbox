$(function () {
    var socket = io();
    $('form').submit(function(e) {
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        $('#messages').append($('<div class="message-container"></div>').append($('<div class="msg"></div>').text(msg)));
    });
});