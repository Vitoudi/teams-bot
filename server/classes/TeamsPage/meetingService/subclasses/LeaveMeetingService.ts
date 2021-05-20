import { Page } from "puppeteer";
import { appState } from "../../../../global/appState";
import { LogManager } from "../../../../models/Logs";
import {
  MeetingLeaveObserver,
  Subject,
} from "../../../observerPettern/ObserverPettern";

export class LeaveMeetingService implements Subject<MeetingLeaveObserver> {
  observers: MeetingLeaveObserver[];
  alredyLeftTheMeeting: boolean;

  constructor(private page: Page) {
    this.observers = [];
    this.alredyLeftTheMeeting = false;
  }

  public async leaveMeeting() {
    if (this.alredyLeftTheMeeting) return;

    const selector = "#hangup-button";
    this.notifyObservers();

    LogManager.createLog({
      eventName: "left_meeting",
      channel: appState.currentChanelName,
    });

    this.alredyLeftTheMeeting = true;

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
