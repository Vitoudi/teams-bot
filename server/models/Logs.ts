import { db } from "../utils/database";
import * as mongoose from "mongoose";
import { appState } from "../global/appState";

const LogSchema = new mongoose.Schema({
  eventName: String,
  channel: String,
  date: { type: Date, default: Date.now },
});

export const Log = mongoose.model('log', LogSchema);

interface ILog {
  eventName: string
  channel: string
  data?: any
}

export class LogManager {
  public static model = Log

  public static createLog({eventName, channel}: ILog) {
    const log = new Log({eventName, channel})
    log.save();
    this.sendEvent(eventName, channel)
  }

  private static sendEvent(eventName: string, channel: string) {
    appState.socket.emit(eventName, channel)
  }
}




