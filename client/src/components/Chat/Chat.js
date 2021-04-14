import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

const ENDPOINT = 'https://project-chat-application.herokuapp.com/';

let socket; //variable stored outside our component

const Chat = ({ location }) => { //location is a prop obtained from react router
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
     //retieve the data that users have entered while joining
    const { name, room } = queryString.parse(location.search); //fetch the data from querystring we get a url from here(?name=ankan&room=room)
    /*We will get an object 
    {
      name: Ankan
      room;room
    }
    */
    
    //when we get our first connectionwe will :
    socket = io(ENDPOINT);//endpoint to The SERVER=localhost:5000 AS A STRING//S

    setRoom(room);
    setName(name)

    //from frontend (client side socket) we emit different events using specific instance of socket
    //Read about socket.emit - https://socket.io/docs/v3/emitting-events/
    socket.emit('join', { name, room }, (error) => { //join is a string (event) recognized in the backend
      //we pass the data as name:name and room:room to the backend.this is es6 syntax.
      if(error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]); //only when endpoint or location.search will change useeffect will run
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;
