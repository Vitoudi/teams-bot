import { Request, Response } from "express";
import {  LogManager } from "../models/Logs";

export async function handleGetInAndOutLogs(req: Request, res: Response) {
    console.log('handle get in and out logs called')
    const logs = await LogManager.model.find({
      $or: [{ eventName: "entered_meeting" }, { eventName: "left_meeting" }],
    });

    console.log('in and out logs: ', logs)

    return res.json(logs || []);
}

export async function handleGetChattLogs(req: Request, res: Response) {
  const logs = await findLogsByEventName("chat_msg_sent");

  console.log('logs', logs)
 
  return res.json(logs || []);
}

async function findLogsByEventName(eventName: string) {
    const logs = await LogManager.model
      .find({ eventName: eventName })
      .sort({ date: 1 });

    return logs
}