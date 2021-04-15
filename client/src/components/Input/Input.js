import React from 'react';

import './Input.css';

const Input = ({ setMessage, sendMessage, message }) => (
  <form className="form">
    <input
      className="input"
      type="text"
      placeholder="Type a message..."
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null} //If enter key is pressed then message will be sent
    />
    <button className="sendButton" onClick={e => sendMessage(e)}>Send</button> 
//if send button is clicked then also message will be sent

  </form>
)

export default Input;
