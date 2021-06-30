import { Page } from "puppeteer";
import { appState } from "../../../../global/appState";
import { LogManager } from "../../../../models/Logs";
import { PageActions } from "../../PageActions";
import { MeetingJoinObserver, Subject } from "../../../observerPattern/observerPattern";

export class JoinMeetingService implements Subject<MeetingJoinObserver> {
  private observers: MeetingJoinObserver[] = [];
  private pageActions: PageActions;
  
  constructor(private page: Page) {
    this.pageActions = new PageActions(page);
  }

  public async joinMeeting(): Promise<void> {
    await this.clickToJoinMeetingInChannel();
    await this.disableCamAndAudio();

    const selector = ".join-btn";
    await this.pageActions.clickBtn(selector);
    console.log("enter meeting event emitted");
    LogManager.createLog({eventName: "entered_meeting", channel: appState.currentChannelName});
  }

  private async clickToJoinMeetingInChannel(): Promise<void> {
    const joinRoomBtnSelector = "calling-join-button button";
    await this.page.waitForSelector(joinRoomBtnSelector);

    await this.page.evaluate((selector) => {
      const joinBtn = document.querySelector(selector);
      if (!joinBtn) return;
      joinBtn.click();
    }, joinRoomBtnSelector);

    this.notifyObservers()
  }

  private async disableCamAndAudio(): Promise<void> {
    const selector = "toggle-button button";
    await this.page.waitForSelector(selector);
    await this.page.waitForTimeout(10 * 1000);

    await this.page.$$eval(selector, (buttons) => {
      buttons.forEach((btn) => {
        const isPressed = eval(btn.getAttribute("aria-pressed")!);
        if (!isPressed) return;
        (btn as any).click();
      });
    });
  }

  public notifyObservers(): void {
    this.observers.forEach(o => o.onJoinMeeting())
  }

  public registerObserver(o: MeetingJoinObserver): void {
    this.observers.push(o);
  }
}
