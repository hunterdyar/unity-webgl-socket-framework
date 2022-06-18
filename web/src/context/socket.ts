import {io, Socket} from "socket.io-client";
import React from "react";
import {ClientToServerEvents, ServerToClientEvents, UserDisplay} from "../../../shared/socketTypes";

export const socket: Socket<ServerToClientEvents,ClientToServerEvents> = io("localhost:3000");

socket.on("hello", (arg) => {
    console.log(arg); // world
});

socket.on("failedToConnectToRoom",(arg)=>{
    console.log("failed to connect to "+arg.room);
});

socket.connect();

export let SocketContext: React.Context<Socket<ServerToClientEvents,ClientToServerEvents>>;
SocketContext = React.createContext(io("localhost:3000"));