import { SocketEventName } from "./types";

export interface ILog {
  channel: string;
  eventName: SocketEventName;
  date: string;
}