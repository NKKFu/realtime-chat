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
    const newUserMessage = { speaker: 'Server', message: `User Connected -> ${socket.id}` };
    socket.emit('previous', messagesHistory, usersList);
    io.emit('chat message', newUserMessage.speaker, newUserMessage.message);
    messagesHistory.unshift(newUserMessage);

    // Mostra o novo usuário à todos
    usersList.push(socket.id);
    io.emit('users add', socket.id);

    socket.on('disconnect', () => {
        io.emit('chat message', `Server`, `User Disconnected -> ${socket.id}`);

        usersList.splice(usersList.indexOf(socket.id), 1);
        io.emit('users remove', socket.id);
    });

    socket.on('chat message', (speaker, message) => {
        messagesHistory.push({ speaker, message });
        io.emit('chat message', speaker, message);
    });
});

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});