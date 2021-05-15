import { Socket } from "socket.io";
import { TeamsPage } from "../classes/TeamsPage/TeamsPage";

export interface IAppState {
  isActive: boolean
  teamsPage: TeamsPage | null
  socket: Socket | null
  currentChanelName: string | null
}

export const appState: IAppState = {
  isActive: false,
  teamsPage: null,
  socket: null,
  currentChanelName: null
}