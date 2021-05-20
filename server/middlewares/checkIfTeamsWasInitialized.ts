import { NextFunction, Request, Response } from "express";
import { appState } from "../global/appState";

export function checkIfTeamsWasInitialized(req: Request, res: Response, next: NextFunction) {
    const isActive = appState.isActive;

    if (!isActive) {
      res.status(400).json({ msg: "teams was not initialized" });
      return;
    }

    next();
}