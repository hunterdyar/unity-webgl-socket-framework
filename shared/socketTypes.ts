export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
    hello: (arg: string) => void;
    failedToConnectToRoom: (arg: {room:string}) => void;
}

export interface ClientToServerEvents {
    hello: (arg: string) => void;
    tryConnectToRoom: (room: string, callback: (status:string)=>void) => void;
    getDisplay: (room:string, callback: (d:UserDisplay)=>void) => void;

}

export interface UserDisplay{
    color: string
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    name: string;
    age: number;
}

