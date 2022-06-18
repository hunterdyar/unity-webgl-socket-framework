"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let port = 3000;
const app = (0, express_1.default)();
// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws_1.default.Server({
    noServer: true,
});
wsServer.on('connection', socket => {
    socket.on('message', message => console.log(message));
});
// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(3000);
server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});
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
let characters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
function randomChar() {
    return characters[Math.floor(Math.random() * characters.length)];
}
function randomLobbyName() {
    return randomChar() + randomChar() + randomChar() + randomChar();
}
//# sourceMappingURL=index.js.map