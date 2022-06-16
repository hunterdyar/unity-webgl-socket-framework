import React from 'react';
import './App.css';
import { io } from 'socket.io-client';

const socket = io("localhost:3000");

socket.on("hello", (arg) => {
    console.log(arg); // world
});
socket.connect();
console.log(socket)

function App() {
    const sendEvent = (data: string) =>{
        socket.emit("event",data);
    }
  return (
    <div className="App">
      <p>i am on a phone.</p>
        <button onClick={()=>sendEvent("hi")}>Hi!</button>
    </div>
  );
}

export default App;
