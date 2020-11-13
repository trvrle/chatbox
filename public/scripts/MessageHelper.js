class MessageHelper {
    createSelfMessage(name, color, timestamp, text) {
        this.createMessage(name, color, timestamp, text, "self");
    }
    
    createChatMessage(name, color, timestamp, text) {
        this.createMessage(name, color, timestamp, text, "chat");
    }
    
    createMessage(name, color, timestamp, text, type) {
        text = this.emojiDecorate(text);
        $('#messages').append(
            $('<div>').addClass(`message-container message-container-${type}`).append(
                $('<div>').addClass("message").append(
                    $('<div>').addClass("message-info").text(`${name} at ${timestamp}`).css("color", color)).append(
                    $('<div>').addClass(`message-content message-content-${type}`).html(text)
                )
            )
        );
        this.updateScroll();
    }
    
    createJoinMessage(name) {
        this.createInfoMessage(name, "joined");
    }
    
    createLeaveMessage(name) {
        this.createInfoMessage(name, "left");
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

    emojiDecorate(text) {
        if(text.includes(":")) {
            text = text.replaceAll(":)", "&#128578;");
            text = text.replaceAll(":(", "&#128577;");
            text = text.replaceAll(":o", "&#128558;");
          }
          return text;
    }
}