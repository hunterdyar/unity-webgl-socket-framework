import WebSocket, { WebSocketServer } from 'ws';
const port = 8080;
const wss = new WebSocketServer({ port: port });

function heartbeat() {
    console.log("pong");
    this.isAlive = true;
}

const rooms = new Map();

wss.on('connection', function connection(ws, req) {
    console.log("connection with "+req.socket.remoteAddress);

    ws.isAlive = true;
    ws.on('pong', heartbeat);

    ws.on('message', function message(data, isBinary) {
        if(isBinary)
        {
            handleBinaryMessage(ws,data);
        }else{
            handleStringMessage(ws,data);
        }

        //temp code to broadcast message to everyone else
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });

});

wss.on('close', function close(ws) {
    //if ws is host, close room.
    console.log("close");
    clearInterval(interval);
});

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
        console.log("ping");
    });
}, 30000);

function handleBinaryMessage(client,data){

}

function handleStringMessage(client,data){

    let message = JSON.parse(data.toString());
    switch(message.message)
    {
        case "newRoom":
            createNewRoom(client,message);
            break;
        case "updateDisplay":
            updateDisplay(client,message);
            break;
    }
}
function createNewRoom(client,data){
        destroyRoomIfClientIsHost(client);
        let rName = randomLobbyName();
        //ensure uniqueness
        while(rooms.has(rName)){
            rName = randomLobbyName();
        }

        let room = {
            id: rName,
            host: client,
            displayForAll: {
                display: "waitingToStart"
            },
            players: [],
            displayForPlayers: [],
        }

        rooms.set(rName,room);
        client.send(JSON.stringify({message:"inNewRoom",data:clientVersionOfRoomData(room)}));
}
function updateDisplay(client, data)
{
    if(rooms.has(data.roomID))
    {
        rooms[data.roomID].displayForAll = data.data.displayForAll;
        rooms[data.roomID].players.forEach((user)=>{

            //todo: broadcast update to clients.
            // user.send()
        })
    }
}

console.log("started server on port "+port);

//todo: move to own file and such.
let characters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','0']

function destroyRoomIfClientIsHost(client){
    //todo: this
    let existingRoomID = undefined;
    rooms.every(function(r,k,m){
        if(r.host === client){
            existingRoomID = r.id;
            return false;
        }
        return true;
    });
    if(typeof existingRoomID !== "undefined")
    {
        //todo: announce destruction to players.
        destroyRoom(existingRoomID);
    }
}

function destroyRoom(roomID)
{
    //todo: announce destruction to players.
    rooms.delete(roomID);
}

function clientVersionOfRoomData(room)
{
    let r = room;
    //strip out sever-only data.
    r.host = undefined;
    r.playerSockets = undefined;

    return JSON.stringify(r);
}

function randomChar()
{
    return characters[Math.floor(Math.random()*characters.length)];
}
function randomLobbyName()
{
    return randomChar()+randomChar()+randomChar()+randomChar();
}