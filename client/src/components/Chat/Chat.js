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
  const [message, setMessage] = useState('');//state for every single messahge initialized as an empty string
  const [messages, setMessages] = useState([]);//An array which stores all messages

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
      
      //what we want to happen after that function socket.on is emitted in the backend
      if(error) {//This error callback function will be executed when callback function on backend is called.
        alert(error); //we get an alert notification with the error
      }
    });
  }, [ENDPOINT, location.search]); //only when endpoint or location.search will change useeffect will run
  
  useEffect(() => {
    socket.on('message', message => {
      //The message can be sent by admin or anyone else. 
      setMessages(messages => [ ...messages, message ]);//Push the message in the messages array (Spread all other messages and add one message on it)
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

  const sendMessage = (event) => {
    event.preventDefault(); //we do not want the full browser to refresh on key press so we prevent the deafult behaviour of a key press
    
    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));//after sending the message our input field will be cleared
    }
  }

  return ( //To make our room name visible in the infobar dynamically use {room} in Infobar and then access it as props in Infobar.js
    //similarly pass the messages ,name as props and similarly all others.
    <div className="outerContainer">
      <div className="container">
          <InfoBar room={room} /> 
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} // message to be displayed,setter function
    />
      </div>
      <TextContainer users={users}/>
    </div>
  );
}

export default Chat;
