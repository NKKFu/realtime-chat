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
    socket.emit('previousMessages', messagesHistory);

    // Mostra o novo usuário à todos
    io.emit('users update', usersList);

    console.log(`User Connected -> ${socket.id}`);
    usersList.push(socket.id);

    socket.on('disconnect', () => {
        console.log(`User Disconnected -> ${socket.id}`);
        usersList.splice(usersList.indexOf(socket.id), 1);
        io.emit('users update', usersList);
    });

    socket.on('chat message', (speaker, message) => {
        messagesHistory.push({ speaker, message });
        console.log(`[ ${speaker} ] ${message}`);
        io.emit('chat message', speaker, message);
    });
});

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});