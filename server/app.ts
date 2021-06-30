require('dotenv').config({path: __dirname + '/.env'});
import express from "express";
import { handleClose, handleTurnOn } from "./controllers/turnOnController";
import { checkIfTeamsWasInitialized } from "./middlewares/checkIfTeamsWasInitialized";
import { handleGetRoomNames, handleObserveRoom } from "./controllers/roomControllers";
import { appState } from "./global/appState";
import * as http from 'http'
import { Server } from "socket.io";
import { configuredCors } from "./middlewares/configuredCors";
import { onMongoConnection } from "./utils/onMongoConnection";
import { handleCheckLoggedIn } from "./controllers/checkLoggedInController";
import { handleGetChattLogs, handleGetInAndOutLogs } from "./controllers/logsController";

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://teams-bot-ten.vercel.app"],
    credentials: true,
  },
});
const PORT = 8000;
let listening = false;

app.use(express.json());
app.use(configuredCors());

app.get("/check_logged_in", handleCheckLoggedIn);

io.on("connection", (socket) => {
  appState.socket = socket;
  socket.emit("on_connected", "hello");
});

app.post("/turn_on", handleTurnOn);

app.use(checkIfTeamsWasInitialized);

app.post("/close", handleClose);

app.get("/room_names", handleGetRoomNames);

app.post("/observe_room", handleObserveRoom);

app.get('/in_and_out_logs', handleGetInAndOutLogs)

app.get("/chat_logs", handleGetChattLogs);

function listen() {
  server.listen(PORT, () => {
    console.log("listening on port: " + PORT);
    listening = true;
  });
}

onMongoConnection(() => {
  !listening && listen();
})
