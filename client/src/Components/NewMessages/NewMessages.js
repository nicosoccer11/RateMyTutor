import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";
import './NewMessages.css';
const socket = io.connect("http://localhost:5000");

function NewMessages() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () =>{
    if (username !== "" && room !== ""){
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };
  

  return (
    <div className = "NewMessages">
      {!showChat ? (
      <div className = "joinChatContainer">
        <h3> Join A chat</h3>
        <input type ="text" 
        placeholder="john..."
        onChange={(event) =>{
          setUsername(event.target.value)
        }}
        />        
        <input type ="text" 
        placeholder="john..."
        onChange={(event) =>{
          setRoom(event.target.value)
        }}
        />      
        <button onClick={joinRoom}> Join a room</button>
      </div>
      )
      : (
        <Chat socket = {socket}  username = {username} room = {room}/> 
      )}
    </div>
  );
}


export default NewMessages;