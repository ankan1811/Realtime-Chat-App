const users = []; //It consists of helper functions which will help us manage users
//like manage user joining in,signing out,removing user,adding user and keep track of what users are in what rooms

const addUser = ({ id, name, room }) => { //id of a user or of a socket instance
  name = name.trim().toLowerCase(); //If user enters the room as My chat it will be mychat
  room = room.trim().toLowerCase();

  
//We will check if there is an existing userwith the username that the secondd user is trying to login with
  
  const existingUser = users.find((user) => user.room === room && user.name === name);//it will be true if the existing user is present

  if(!name || !room) return { error: 'Username and room are required.' };
  
  if(existingUser) return { error: 'Username is taken.' };//display it

  //if there is no existing user we will create a user
  const user = { id, name, room };

  users.push(user); //push the user to the array

  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id); //find the id of that user and check in the array if any user's id becomes equal to the given id.
  //If such an id does not exist index will be -1.

  //In all other cases
  if(index !== -1) return users.splice(index, 1)[0];//This will return our spliced user and remove that user from user's array
}

const getUser = (id) => users.find((user) => user.id === id); //Give the id as prop and if that id exists simply return the user

const getUsersInRoom = (room) => users.filter((user) => user.room === room);//We want all users from that specific room

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
