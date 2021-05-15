import { Request, Response } from "express";
import { Session } from "express-session";
import { Socket } from "socket.io";
import { io } from "../app";
import { TeamsPage } from "../classes/TeamsPage/TeamsPage";
import { appState } from "../global/appState";
import { getConfiguredPuppeteerPage } from "../utils/setPuppetearConfig";

export async function handleTurnOn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log("in TurnOn", req.session.id);

      await initTeams({email, password}, req);

      (req.session as any).loggedIn = true;
      console.log('after login: ', req.session)
      req.session.save() 

      return res.json({ msg: "ok" });
    } catch (err) {
      console.error(err)
      return res.status(500).json({ err: "Something went wrong", details: err });
    }
}

async function initTeams({email, password}, req: Request) {
    const page = await getConfiguredPuppeteerPage();
    const loginInfo = {email, password};
    appState.teamsPage = new TeamsPage(page, loginInfo);
    await appState.teamsPage.initTeams();
    appState.isActive = true;
}