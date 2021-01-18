const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./util/message');
const { userJoin, getCurrentUser, userLeave, getRoomUser } = require('./util/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const chatBot = "ChatRoom";

// Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when user connects
io.on('connection', socket => {
    // console.log('New connection connected...');
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // give only one user who connects her/hisself
        socket.emit('message', formatMessage(chatBot, 'Welcome to ChatRooms'));

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has joined to the Chat`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUser(user.room)
        });

    });


    // Listen the message chatmessage from frontend side
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has left the Chat`));
        }

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUser(user.room)
        });
    });
    
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});