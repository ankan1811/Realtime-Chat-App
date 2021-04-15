//In Messages.js we loop through all the messages but we do not have access to it so we pass the messages as props in chat.js
import React from 'react';


import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message';

import './Messages.css';

const Messages = ({ messages, name }) => ( //for each message we will generate a key which is index i
  <ScrollToBottom className="messages">
    {messages.map((message, i) => <div key={i}><Message message={message} name={name}/></div>)}
  </ScrollToBottom>
);

export default Messages;
