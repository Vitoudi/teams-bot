import * as session from "express-session";
import { dbUri } from "../utils/database";
const MongoStore = require("connect-mongo");

export function configuredSession() {
  const sessionMiddleWare = session({
    secret: "mysecret",
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false },
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: dbUri, collectionName: "sessions" }),
  });

  return sessionMiddleWare
}
