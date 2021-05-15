import * as express from "express";
import { handleTurnOn } from "./controllers/turnOnController";
import { checkIfTeamsWasInitialized } from "./middlewares/checkIfTeamsWasInitialized";
import { handleGetRoomNames, handleObserveRoom } from "./controllers/roomControllers";
import { appState } from "./global/appState";
import * as http from 'http'
import { Server } from "socket.io";
import { configuredCors } from "./middlewares/configuredCors";
import { TeamsPage } from "./classes/TeamsPage/TeamsPage";
import {configuredSession} from './middlewares/configuredSession'
import { onMongoConnection } from "./utils/onMongoConnection";


declare global {
  namespace Express {
    interface Request {
      teamsPage: TeamsPage,
    }
  }
}

const app = express();
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: "http://localhost:3000", credentials: true } });
const PORT = 8000;


const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, socket.request.res || {}, next);

app.use(express.json());
app.use(configuredCors());
app.use(configuredSession());
io.use(wrap(configuredSession()));

app.get("/setCookies", (req, res) => {
  console.log('get cookies called')
  res.json({ msg: "ok" });
});

io.on("connection", (socket) => {
  appState.socket = socket;
  console.log("connected with session: ", (socket.request as any).session);

  console.log("sessionId : ", (socket.request as any).session.id);
  socket.emit("on_connected", "hello");
});

app.post("/turn_on", handleTurnOn);

app.use(checkIfTeamsWasInitialized);

app.get("/room_names", handleGetRoomNames);

app.post("/observe_room", handleObserveRoom);

function listen() {
  server.listen(PORT, () => {
    console.log("listening on port: " + PORT);
  });
}

onMongoConnection(listen)




