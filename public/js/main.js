const loginForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const userList = document.getElementById('users');

const socket = io();

//getting user name and room name
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

//fire when user jions
socket.emit('joinRoom', { username, room });

//printing users 
socket.on('roomUsers', ({ room, users }) => {
    displayRoom(room);
    displayUserNames(users);

})

socket.on('message', (message) => {
    // console.log(message);    
    displayMessage(message);
    //scroll to message
    chatMessage.scrollTop = chatMessage.scrollHeight;
})

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // getmessage text 
    const msg = e.target.elements.msg.value;
    // emit message to all users 
    socket.emit('chatMessage', msg);
    //making box value to nill
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

function displayMessage(message) {
    const div = document.createElement('div');
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time} </span></p>
    <p class="text">
     ${message.text}
    </p>`

    //append child to the div
    chatMessage.appendChild(div);
}

//displaying room 
function displayRoom(room) {
    document.getElementById('room-name').innerHTML = room;
}

function displayUserNames(userName) {
    // console.log(userName)
    userList.innerHTML = `${userName.map(user => `<li>${user.username}</li>`).join(``)}`;
}