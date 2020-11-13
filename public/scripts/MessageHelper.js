class MessageHelper {
    createSelfMessage(name, color, timestamp, text) {
        this.createMessage(name, color, timestamp, text, "self");
    }
    
    createChatMessage(name, color, timestamp, text) {
        this.createMessage(name, color, timestamp, text, "chat");
    }
    
    createMessage(name, color, timestamp, text, type) {
        $('#messages').append(
            $('<div>').addClass(`message-container message-container-${type}`).append(
                $('<div>').addClass("message").append(
                    $('<div>').addClass("message-info").text(`${name} at ${timestamp}`).css("color", color)).append(
                    $('<div>').addClass(`message-content message-content-${type}`).text(text)
                )
            )
        );
        this.updateScroll();
    }
    
    createJoinMessage(name) {
        createInfoMessage(name, "joined");
    }
    
    createLeaveMessage(name) {
        createInfoMessage(name, "left");
    }
    
    createInfoMessage(name, type) {
        $('#messages').append(
            $('<div>').addClass("message-container message-container-chat").append(
                $('<div>').addClass("message").append(
                    $('<div>').addClass("message-info").text(`${name} has ${type} the chat`)
                )
            )
        );
        this.updateScroll();
    }
    
    updateScroll() {
        let messages = document.getElementById("messages");
        messages.scrollTop = messages.scrollHeight;
    }
}