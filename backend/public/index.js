const socket = io();

// Send a message
function sendMessage() {
    const messageContent = document.getElementById('message_content');
    socket.emit('chat message', socket.id, messageContent.value);

    // Clear input
    messageContent.value = '';
}

// Receives a message
const messageList = document.getElementById('messages');
socket.on('chat message', function (speaker, message) {
    const messageElement = document.createElement('li');
    messageElement.innerHTML = `<b>[ ${speaker} ]</b> ${message}`;

    messageList.append(messageElement);
});

socket.on('previousMessages', function (messages) {
    for (const message in messages) {
        if (messages.hasOwnProperty(message)) {
            const element = messages[message];
            const messageElement = document.createElement('li');
            messageElement.innerHTML = `<b>[ ${element.speaker} ]</b> ${element.message}`;
            messageList.append(messageElement);
        }
    }
});

// Receives a user update
const usersList = document.getElementById('users');
socket.on('users update', function (users) {
    usersList.innerHTML = '';

    users.map((user) => {
        const userObject = document.createElement('p');
        userObject.innerHTML = `- ${user}`;
        usersList.append(userObject);
    });
});