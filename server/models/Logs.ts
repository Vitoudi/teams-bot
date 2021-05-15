import { db } from "../utils/database";
import * as mongoose from "mongoose";
import { appState } from "../global/appState";

const LogSchema = new mongoose.Schema({
  text: String,
})

LogSchema.methods.hello = () => {}

const Log = mongoose.model('log', LogSchema);

interface ILog {
  eventName: string
  text: string
  data?: any
}

export class LogManager {
  public static createLog({eventName, text, data}: ILog) {
    const log = new Log({text})
    log.save();
    this.sendEvent(eventName, data)
  }

  private static sendEvent(eventName: string, data?: any) {
    appState.socket.emit(eventName, data)
  }
}



