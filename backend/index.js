const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

const messagesHistory = [];
const usersList = [];

// Disponibiliza todos os caminhos do diretório public
app.use(express.static('public'));

io.on('connection', (socket) => {

    // Faz o buffer (atualização) para o usuário novato
    socket.emit('previous', messagesHistory, usersList);

    const newUserMessage = { speaker: '', message: `<p style="color: green;"><b>${socket.id}</b> joined the room</p>` };
    sendMessage(newUserMessage.speaker, newUserMessage.message);

    // Mostra o novo usuário à todos
    usersList.push(socket.id);
    io.emit('users add', socket.id);

    socket.on('disconnect', () => {
        sendMessage('', `<p style="color: red;"><b>${socket.id}</b> left the room</p>`);

        usersList.splice(usersList.indexOf(socket.id), 1);
        io.emit('users remove', socket.id);
    });

    socket.on('chat message', (speaker, message) => {
        sendMessage(speaker, message);
    });

    function sendMessage(speaker, message) {
        // Remover o histórico
        messagesHistory.splice(5, 10);

        // Adiciona a nova mensagem
        messagesHistory.push({ speaker, message });
        io.emit('chat message', speaker, message);
    }
});

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});