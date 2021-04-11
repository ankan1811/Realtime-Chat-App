import React from 'react';

import Chat from './components/Chat/Chat';
import Join from './components/Join/Join';

import { BrowserRouter as Router, Route } from "react-router-dom";
//When the user is first time on the page he will be greeted for the first time with the join component.Then he will pass his data in 
//the login form and through query stringwe will pass the data through to the chat

//once we have the data we will render the chat component

const App = () => {
  return ( //We pass the following component which has to be rendered on that particular path
    //In /chat it will not be an exact path since we will pass properties
    <Router>
      <Route path="/" exact component={Join} />
      <Route path="/chat" component={Chat} />
    </Router>
  );
}

export default App;
