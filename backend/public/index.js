const socket = io();

// Send a message
function sendMessage() {
    const messageContent = document.getElementById('message_content');
    socket.emit('chat message', socket.id, messageContent.value);

    // Clear input
    messageContent.value = '';
}

const messageList = document.getElementById('messages');
const usersList = document.getElementById('users');

socket.on('chat message', function (speaker, message) {
    // Receives a message

    const messageElement = document.createElement('li');
    messageElement.innerHTML = `<b>[ ${speaker} ]</b> ${message}`;

    messageList.append(messageElement);
});

socket.on('previous', function (messages, users) {
    for (const message in messages) {
        // Buffer de todas as mensaggens na sala

        if (messages.hasOwnProperty(message)) {
            const element = messages[message];
            const messageElement = document.createElement('li');
            messageElement.innerHTML = `<b>[ ${element.speaker} ]</b> ${element.message}`;
            messageList.append(messageElement);
        }
    }
    console.log(users);

    users.map((element) => {
        console.log(element);
        // Buffer de todos usuários na sala

        const userObject = document.createElement('p');
        userObject.innerText = `- ${element}`;
        usersList.append(userObject);
    });
});

socket.on('users add', function (user) {
    console.log(user);

    // Receives a user update to add
    const userToAddObject = document.createElement('p');
    userToAddObject.innerHTML = `- ${user}`;
    usersList.append(userToAddObject);
});

socket.on('users remove', function (user) {
    console.log(user);

    // Receives a user update to remove

    for (let i = 0; i < usersList.children.length; i++) {
        const element = usersList.children[i];
        if (element.innerText === `- ${user}`) {
            usersList.removeChild(element);
        }
    }
});