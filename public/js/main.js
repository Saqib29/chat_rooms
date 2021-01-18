const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
// console.log(username, room);

const socket = io();

// join chatroom
socket.emit('joinRoom', { username, room });

// Get users and room
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// message get from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //  scroll down 
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message sent
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get message text
    const msg = e.target.elements.msg.value;
    document.getElementById("msg").value = '';
    document.getElementById("msg").focus();

    // Emit message to the server
    socket.emit('chatMessage', msg);
});

// output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');

    div.innerHTML = `<p class="meta">${ message.username } <span>  ${ message.time }</span></p>
                    <p class="text">${ message.text }</p>`;

    document.getElementById("chat-messages").appendChild(div);
}

// Add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${ user.username }</li>`).join('')}
    `;
}