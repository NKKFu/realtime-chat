const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

const usersList = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    console.log(`User Connected -> ${socket.id}`);
    usersList.push(socket.id);
    io.emit('users update', usersList);

    socket.on('disconnect', () => {
        console.log(`User Disconnected -> ${socket.id}`);
        usersList.splice(usersList.indexOf(socket.id), 1);

        console.log(usersList);
        console.log(' - - - ');

        io.emit('users update', usersList);
    });

    socket.on('chat message', (speaker, message) => {
        console.log(`[ ${speaker} ] ${message}`);

        io.emit('chat message', speaker, message);
    });
});

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});