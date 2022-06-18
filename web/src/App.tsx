import React from 'react';
import './App.css';
import { io } from 'socket.io-client';
import ConnectionCard from "./components/connection";
import {SocketContext, socket} from "./context/socket";


function App() {
  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
      <p>i am on a phone.</p>
        <ConnectionCard />
      </SocketContext.Provider>
    </div>

  );
}

export default App;
