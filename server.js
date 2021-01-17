const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


// Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log('New connection connected...');

    // give only one user who connects her/hisself
    socket.emit('message', 'Welcome to ChatRooms');

    // Broadcast when a user connects
    socket.broadcast.emit('message', 'A new user has joined to the Chat');

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the Chat');
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});