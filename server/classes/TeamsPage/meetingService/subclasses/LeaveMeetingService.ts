import { Page } from "puppeteer";
import { appState } from "../../../../global/appState";
import { LogManager } from "../../../../models/Logs";
import {
  MeetingLeaveObserver,
  Subject,
} from "../../../observerPattern/observerPattern";

export class LeaveMeetingService implements Subject<MeetingLeaveObserver> {
  private observers: MeetingLeaveObserver[] = [];
  public alreadyLeftTheMeeting: boolean = false;

  constructor(private page: Page) { }

  public async leaveMeeting() {
    console.log("already in leave: ", this.alreadyLeftTheMeeting)
    if (this.alreadyLeftTheMeeting) return;

    const selector = "#hangup-button";
    this.notifyObservers();

    LogManager.createLog({
      eventName: "left_meeting",
      channel: appState.currentChannelName,
    });

    this.alreadyLeftTheMeeting = true;

    await this.page.$eval(selector, (btn) => {
      (btn as any).click();
    });
  }

  public notifyObservers() {
    this.observers.forEach((o) => {
      o.onMeetingLeave();
    });
  }

  public registerObserver(o: MeetingLeaveObserver) {
    this.observers.push(o);
  }
}
