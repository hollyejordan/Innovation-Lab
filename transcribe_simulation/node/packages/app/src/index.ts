import { LogType, SocketPersistent, SocketServer } from "shared"

const ESP_URL = "ws://localhost:9002";
const WEBSERVER_URL = "ws://localhost:9067";

// let esp = new SocketPersistent(ESP_URL);
let webserver = new SocketServer(8080, LogType.INFO | LogType.INCOMING);

console.log("HI")

//webserver.ready().then(() => { console.log("ON") })

webserver.on_message((msg) =>
{
    console.log("IN", msg)
    //if (Buffer.isBuffer(msg)) esp.send(msg);
    //else console.log("NOT MSG")
})

