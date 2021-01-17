const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./util/message');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const chatBot = "ChatRoom";

// Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
    console.log('New connection connected...');

    // give only one user who connects her/hisself
    socket.emit('message', formatMessage(chatBot, 'Welcome to ChatRooms'));

    // Broadcast when a user connects
    socket.broadcast.emit('message', formatMessage(chatBot, 'A new user has joined to the Chat'));

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(chatBot,'A user has left the Chat'));
    });

    // Listen the message chatmessage from frontend side
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});