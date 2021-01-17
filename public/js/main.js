const chatForm = document.getElementById('chat-form');
const socket = io();

// message get from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
});

// Message sent
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get message text
    const msg = e.target.elements.msg.value;

    // Emit message to the server
    socket.emit('chatMessage', msg);
});

// output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');

    div.innerHTML = `<p class="meta">Brad <span> 9:12</span></p>
                    <p class="text">${message}</p>`;

    document.getElementById("chat-messages").appendChild(div);
}