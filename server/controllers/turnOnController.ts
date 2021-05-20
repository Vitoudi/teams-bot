import { Request, Response } from "express";
import { Session } from "express-session";
import * as jwt from "jsonwebtoken";
import { TeamsPage } from "../classes/TeamsPage/TeamsPage";
import { appState } from "../global/appState";
import { User, UserManager } from "../models/User";
import { getConfiguredPuppeteerPage } from "../utils/setPuppetearConfig";

interface UpdateSessionValueOptions {
  propName: string;
  value: any;
  session: Session;
}

export async function handleTurnOn(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    await initTeams({ email, password }, req);

    const jsonToken = jwt.sign(
      { loggedIn: true, email },
      process.env.ACCESS_TOKEN_SECRET
    );

    appState.currentEmail = email;

    UserManager.createUserIfNotExits(email)

    return res.json(jsonToken);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: "Something went wrong", details: err });
  }
}

export async function handleClose(req: Request, res: Response) {
  console.log("handle close called");
  await appState.teamsPage.closeTeams();
  appState.currentEmail = '';

  const jsonToken = jwt.sign(
    { loggedIn: false },
    process.env.ACCESS_TOKEN_SECRET
  );

  return res.json(jsonToken);
}

async function initTeams({ email, password }, req: Request) {
  const page = await getConfiguredPuppeteerPage();
  const loginInfo = { email, password };
  appState.teamsPage = new TeamsPage(page, loginInfo);
  await appState.teamsPage.initTeams();
  appState.isActive = true;
}
