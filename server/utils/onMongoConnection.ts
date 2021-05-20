import { db } from "./database";

export function onMongoConnection(callback: Function) {
  db.once("open", () => {
    console.log("db connected");
    callback();
  });
}
