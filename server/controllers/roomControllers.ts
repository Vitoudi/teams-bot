import { Request, Response } from "express";
import { appState } from "../global/appState";

export async function handleGetRoomNames(req: Request, res: Response) {

 const roomNames = await appState.teamsPage.getRoomNames();
 res.json(roomNames);
}

export async function handleObserveRoom(req: Request, res: Response) {
    const roomName = req.body.roomName;
    await appState.teamsPage.observeRoom(roomName);

    res.json({ msg: roomName });
}