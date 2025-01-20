import { SocketPersistent } from "shared"

const ESP_URL = "ws://localhost:9002";
const WEBSERVER_URL = "ws://localhost:9067";

(async () =>
{
    let esp = new SocketPersistent(ESP_URL);
    let webserver = new SocketPersistent(WEBSERVER_URL);

    // Relay audio to server
    esp.on_message_received((msg) =>
    {
        if (Buffer.isBuffer(msg)) webserver.send(msg);
        else console.log("NOT MSG")
    })

    webserver.on_message_received((msg) =>
    {
        if (Buffer.isBuffer(msg)) esp.send(msg);
        else console.log("NOT MSG")
    })
})()