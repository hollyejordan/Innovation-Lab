import { SocketPersistent } from "shared"

const WEBSERVER_URL = "wss://visualeyes-relay-xxbi8.ondigitalocean.app/";

(async () =>
{
    let webserver = new SocketPersistent(WEBSERVER_URL);

    webserver.on_message_received((msg) =>
    {
        console.log(msg);
    })

    setInterval(() =>
    {
        webserver.send("hello");
    }, 2000)

})()