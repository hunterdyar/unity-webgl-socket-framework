import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

import dotenv from "dotenv";

dotenv.config();

let port = 3000;
if (process.env.PORT) {
    port = parseInt(process.env.PORT);
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3001"
    }
});
const rooms = new Map();
rooms.set('room',{
    id: 'room',
    users: [],
    displayForAll: {
        color: "#348d86"
    }
});

io.on('connection', function(socket) {
    let q = socket.handshake.query;
    let roomName = q.room;

    socket.join(roomName);
    console.log(socket.id);
    socket.emit("hello","world");

    socket.on("createRoom",function(data, reply){
        let roomID = randomLobbyName();
        //todo: check for existing room.
        rooms.set(roomID,{
            id: roomID,
            users: [],
            displayForAll: {
                page: "waitingForPlayers",
                color: "#ffffff"
            },
            lastEventTime: 0
        });
        socket.join(roomID);
        socket.in(roomID).emit("roomUpdate",rooms[roomID]);
        reply(roomID);
    });
    socket.on("joinRoom",function(data,reply){
       if(rooms.has(data.roomID)){
           rooms.get(data.roomID).users.push({
               displayName: data.displayName,
               displayColor: data.displayColor,
               socket: socket
           })

           socket.in(data.roomID).emit("roomUpdate",rooms[data.roomID]);
       }else{
           reply("failure");
       }
    });

    socket.on("tryConnectToRoom",function(data, reply){
        if(rooms.has(data)) {
            socket.join(data.room);
            rooms.get(data).users.push(socket.id);
            reply("success");
        }else{
            socket.emit("failedToConnectToRoom",data);
            reply("failure");
        }
    });

    socket.on("disconnect",function (data) {
        //in this users room....
        socket.rooms.forEach((roomID)=>{
            if(rooms.has(roomID)){
                let u = rooms[roomID].users.find(x=>x.socket.id = socket.id)
                rooms[roomID].users.remove(u);
                socket.in(roomID).emit("roomUpdate",rooms[roomID]);
            }
        })
        socket.in(Array.from(socket.rooms)).emit("disconnected",socket.id);
    });

    socket.on("getDisplay",function (room, dataCallback) {
        //in this users room....

        if(rooms.has(room)){
            dataCallback(rooms.get(room).displayForAll);
        }else{
            dataCallback("failure");
        }
    });

});

io.listen(port);
console.log("listening on "+port);

//todo: refactor all of the lobby name code. move to new files and json stuff.
//Lobby Name Things.
function newRandomLobbyName()
{
    //todo: this was javascript map? change to TS
    //check if room with this id already has a connection. Ensuring its empty. if not empty, recursively try again.
    // if(io.sockets.in(n).size > 0)
    // {
    //     return newRandomLobbyName();
    // }

    return randomLobbyName();

}

//todo: move to own file and such.
let characters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','0']

function randomChar():string
{
    return characters[Math.floor(Math.random()*characters.length)];
}
function randomLobbyName():string
{
    return randomChar()+randomChar()+randomChar()+randomChar();
}
