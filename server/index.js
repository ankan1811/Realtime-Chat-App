const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app); //create the server
const io = socketio(server);//instance of socketio

app.use(cors());
app.use(router);

//We have to integrate socket.io
io.on('connect', (socket) => {
  //this socket will be connected as a client side socket
  //io.on is a method and it will run when we have a client connection on our io instance
  //We will use this method connect to register clients joining into our chat app
  
  socket.on('join', ({ name, room }, callback) => { //we mentioned this in client/chat.js. we get these data from the frontend.
    
    const { error, user } = addUser({ id: socket.id, name, room });//socket.id is the id of a specific socket instance
    //addUser function can only return an error or a user

    if (error) return callback(error); //we have access to this callback as a toward parameter to emit function

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();//we can trigger some response immediately after socket.on is being emmitted and we will do error handling
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  ////We will use this method disconnect to register clients leaving from our chat app
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`)); //to run the server in browser localhost:5000
