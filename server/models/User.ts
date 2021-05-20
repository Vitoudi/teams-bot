import * as mongoose from "mongoose";
import { appState } from "../global/appState";

type LogType = "chat" | "in-out"

interface ILog {
  eventName: string;
  text: string;
  type: LogType;
  data?: any;
}

const UserSchema = new mongoose.Schema({
  email: String,
  logs: [{ text: String, type: String, date: Date }],
});

UserSchema.methods.createLog = function(logConfig: ILog) {
    //this.name
};

export const User = mongoose.model("user", UserSchema);


export class UserManager {
  constructor(private user: any) {}

  public static async createLog({ eventName, text, data, type }: ILog) {
    const user = await User.find() as any

    console.log('db user: ', user)

    /*if (user) {
        user.logs = [...user.logs, { text, type, date: Date.now() }];
        user.save();
    }*/
    
    this.sendEvent(eventName, data);
  }

  public static async createUserIfNotExits(email: string) {
    const userInDb = (await User.findOne({ email: appState.currentEmail })) as any;
    if (userInDb) return;

    const user = new User({ email });
    user.save();
  }

  private static sendEvent(eventName: string, data?: any) {
    appState.socket.emit(eventName, data);
  }
}
