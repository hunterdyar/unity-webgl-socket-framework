"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let port = 3000;
if (process.env.PORT) {
    port = parseInt(process.env.PORT);
}
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:3001"
    }
});
io.on('connection', function (socket) {
    console.log(socket.id);
    socket.emit("hello", "world");
    socket.on("event", function (data) {
        console.log("event: " + data);
    });
});
// let q = socket.handshake.query;
// let roomName = q.room;
// if (roomName === "") {
//     roomName = newRandomLobbyName();
// }
// socket.join(roomName);
// //Send this event to everyone in the room.
// io.in(roomName).emit('connectToRoom', roomName);
// // //Whenever someone disconnects this piece of code executed
// // socket.on('disconnect', function () {
// //   console.log('A user disconnected');
// // });
//
// socket.on("joinRoom", function (data) {
//     //todo: check if client is already in room.
//     socket.rooms;
//     //todo: check if room is new?
//
//     //todo: check for null.
//     data = data.toString();
//     if (data) {
//         let oldRooms = Array.from(socket.rooms);//This doesn't feel right. Todo: somebody fix this.
//         for (let i = 1; i < oldRooms.length; i++) {
//             let r = oldRooms[i];
//             socket.leave(r);
//         }
//         socket.join(data);
//         // socket.emit("connectToRoom", data);//todo: why isn't this updating?
//         io.sockets.in(data).emit('connectToRoom', data);
//
//     }
// });
io.listen(port);
console.log("listening on " + port);
//todo: refactor all of the lobby name code. move to new files and json stuff.
//Lobby Name Things.
function newRandomLobbyName() {
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
        'pancake', 'billy', 'dungeon', 'dragon', 'sword', 'jail', 'arrow', 'happy', 'quest', 'volcano', 'knife', 'ring', 'item', 'journey', 'destiny', 'marathon', 'blizzard', 'storm', 'squire', 'blacksmith', 'dagger', 'dreams'];
let nameTwos = ['adventure', 'hundred', 'great', 'simple', 'orange', 'green', 'red', 'yellow', 'blue', 'purple', 'chase', 'axe', 'magic', 'wizard', 'ninja', 'tornado', 'light', 'flower', 'teleport'];
function randomLobbyName() {
    return nameOnes[Math.floor(Math.random() * nameOnes.length)] + "-" + Math.floor(Math.random() * 10) + "-" + nameTwos[Math.floor(Math.random() * nameTwos.length)] + "-" + Math.floor(Math.random() * 10);
}
//# sourceMappingURL=index.js.map