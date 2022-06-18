import {Button, Card, Divider, TextField} from "@mui/material";
import {socket, SocketContext} from '../context/socket';
import {useContext, useState} from "react";
import { UserDisplay} from '../../../shared/socketTypes';


function ConnectionCard()
{
    const [color, setColor] = useState("#ffffff");
    const socket = useContext(SocketContext);
    const onConnect = ()=>{
        socket.emit("tryConnectToRoom","room", (stat)=>{
            if(stat === "success"){
                console.log("connected to room!");
                socket.emit("getDisplay","room", (response: UserDisplay)=>{
                    console.log("got display",response);
                    setColor(response.color);
                });
            }else if(stat === "failure")
            {
                console.log("failed to connect");
            }
        })
    }
    return(
        <Card>
            <TextField id="standard-basic" label="Room Code" variant="standard" />
            <Divider />
            <TextField id="standard-basic" label="Display Name" variant="standard" />
            <Button onClick={onConnect}>Go!</Button>
            <p>{color}</p>
        </Card>
    );
}

export default ConnectionCard;