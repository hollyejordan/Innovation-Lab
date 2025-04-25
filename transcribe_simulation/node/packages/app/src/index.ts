import { LogType, SocketPersistent, SocketServer } from "shared"

const ESP_URL = "ws://localhost:9002";
const WEBSERVER_URL = "ws://localhost:9067";

const socket = new SocketServer(3067, LogType.ERROR | LogType.INFO | LogType.INCOMING);
