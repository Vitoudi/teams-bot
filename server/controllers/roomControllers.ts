import { Request, Response } from "express";
import { appState } from "../global/appState";

export async function handleGetRoomNames(req: Request, res: Response) {

    console.log('in handleGetRooms', req.session)
 /*if (!appState.teamsPage) {
   res.status(400).json({ msg: "teams was not initialized" });
   return;
 }*/

 const roomNames = await appState.teamsPage.getRoomNames();
 res.json(roomNames);
}

export async function handleObserveRoom(req: Request, res: Response) {
    console.log("in handleObserveRoom", req.session.id);
    const roomName = req.body.roomName;
    /*if (!appState.teamsPage) {
      res.status(400).json({ msg: "teams was not initialized" });
      return;
    }*/

    await appState.teamsPage.observeRoom(roomName);

    res.json({ msg: roomName });
}