import * as express from "express";
import {Server} from "socket.io";
import * as path from "path";
import * as http from 'http'
import { appState as appState } from "./global/appState";

const PORT = 9000;
const server = http.createServer();
const io = new Server(server, {cors: {origin: "*"}});

io.on("connection", (socket) => {
    appState.socket = socket;
    console.log('connected')
    socket.emit("on_connected", "hello");
});

export function initSocketServer() {
    server.listen(PORT, () => {
      console.log("SOCKET - lintening on port: " + PORT);
    });
}