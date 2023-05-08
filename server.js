const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utilities/msgFormat');
const { userJion, getUserName, getRoomUsers, userPop } = require('./utilities/users');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const io = socketio(server);

//set staic folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'anm.chat';
// run when client connects 
io.on('connection', (socket) => {
    console.log('new user connected to the server');
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJion(socket.id, username, room);
        socket.join(user.room);
        //wellcoming to current user
        socket.emit('message', formatMessage(botName, 'welcome to the anm.chat'));

        // boradcast to al the users when new one join 
        socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} joined chat`));
        //printing user names
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    });

    //getting message from users 
    socket.on('chatMessage', (msg) => {
        const user = getUserName();
        const userName = user.find(users => users.id === socket.id);
        const userName3 = Object.assign({}, userName);
        io.to(userName3.room).emit('message', formatMessage(userName3.username, msg));
    });

    //when user disconnect the server
    socket.on('disconnect', () => {
        const user = getUserName();
        const userName = user.find(users => users.id === socket.id);
        const elmenetUser = userPop(socket.id);
        const userName3 = Object.assign({}, userName);
        if (userName3) {
            io.to(userName3.room).emit(
                'message',
                formatMessage(botName, `${userName3.username} disconnected`));

            io.to(userName3.room).emit('roomUsers', {
                room: userName3.room,
                users: getRoomUsers(userName3.room)
            })
        }
    })

});


server.listen(port, (error) => {
    if (error) {
        console.log(`ther is an error in the server ${error}`);
    } else {
        console.log(`server listening at port ${port}`);
    }
})