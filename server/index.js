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
    //addUser function can only return an error or a user made in users.js

    //So if there is an error it will just show the error dynamically that'username has taken' and we will be out of this function due to return
    if (error) return callback(error); //we have access to this callback as a toward parameter to emit function

    socket.join(user.room); //socket.join is inbuilt which joins an user in a room
  
    //Here we emit event message from the backend to the frontend. so socket.emit
    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });//We can emit event message along with payload
    
    //broadcast will send a message to everyone besides that specific user (to let everyone in the room know that some user has joined
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

      //we can trigger some response immediately after socket.on is being emmitted and we will do error handling
    
    //The callback at the frontend i.e. the arrow function gets called everytime
    callback();//So if there is no error then no error will be passed to the frontend ,then the if statement in the frontend in chat.js will not run
  });

  //we expect event on the backend so use socket.on which is the emit listener
  //Admin generated message has event ‘message’ and user generated message has event sendMessage.
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id); //we get the user who send that message .
    //This is a specific client socket.to instance so this is a specific user and we have his/her id

    //we send the message to the user's room
    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();//we always have callback so that we can do something after the message is sent on the frontend
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
