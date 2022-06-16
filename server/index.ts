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

io.on('connection', function(socket) {
    let q = socket.handshake.query;
    let roomName = q.room;
    if (roomName === "") {
        roomName = newRandomLobbyName();
    }
    socket.join(roomName);

    console.log(socket.id);
    socket.emit("hello","world");
    socket.on("event",function(data){
        console.log("event: "+data);
    })
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
let nameOnes = ['banana' +
'pancake','billy','dungeon','dragon','sword','jail','arrow','happy','quest','volcano','knife','ring','item','journey','destiny','marathon','blizzard','storm','squire','blacksmith','dagger','dreams']
let nameTwos = ['adventure','hundred','great','simple','orange','green','red','yellow','blue','purple','chase','axe','magic','wizard','ninja','tornado','light','flower','teleport']

function randomLobbyName():string
{
    return nameOnes[Math.floor(Math.random()*nameOnes.length)]+"-"+Math.floor(Math.random()*10)+"-"+nameTwos[Math.floor(Math.random()*nameTwos.length)]+"-"+Math.floor(Math.random()*10);
}
