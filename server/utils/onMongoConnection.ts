import { db } from "./database";

export function onMongoConnection(callback: Function) {
  db.on("open", () => {
    console.log("db connected");
    callback();
  });
}
