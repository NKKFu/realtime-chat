const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    console.log(`User Connected -> ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`User Disconnected -> ${socket.id}`);
    });

    socket.on('chat message', (speaker, message) => {
        console.log(`[ ${speaker} ] ${message}`);

        io.emit('chat message', speaker, message);
    });
});

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});