import { Browser } from "puppeteer";
import { Socket } from "socket.io";
import { TeamsPage } from "../classes/TeamsPage/TeamsPage";

export interface IAppState {
  isActive: boolean
  browser: Browser | null
  teamsPage: TeamsPage | null
  socket: Socket | null
  currentChannelName: string
  currentEmail: string
}

export const appState: IAppState = {
  isActive: false,
  teamsPage: null,
  socket: null,
  currentChannelName: '',
  currentEmail: '',
  browser: null
}