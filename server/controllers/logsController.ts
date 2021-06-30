import { Request, Response } from "express";
import {  LogManager } from "../models/Logs";

export async function handleGetInAndOutLogs(req: Request, res: Response) {
    console.log('handle get in and out logs called')
    let logs = await LogManager.model
      .find({
        $or: [{ eventName: "entered_meeting" }, { eventName: "left_meeting" }],
      })
      .sort({ date: - 1 })
      .limit(10);

    logs = logs?.reverse();
      
    return res.json(logs || []);
}

export async function handleGetChattLogs(req: Request, res: Response) {
  const logs = await findLogsByEventName("chat_msg_sent");
 
  return res.json(logs || []);
}

async function findLogsByEventName(eventName: string) {
    let logs = await LogManager.model
      .find({ eventName: eventName })
      .sort({ date: - 1 })
      .limit(10);
      
    logs = logs?.reverse();

    return logs
}