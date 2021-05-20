import { Page } from "puppeteer";
import { appState } from "../../../../global/appState";
import { LogManager } from "../../../../models/Logs";
import { PageActions } from "../../PageActions";

export class JoinMeetingService {
  private pageActions: PageActions;
  
  constructor(private page: Page) {
    this.pageActions = new PageActions(page);
  }

  public async joinMeeting() {
    await this.clickToJoinMeetingInChanel();
    await this.disableCamAndAudio();

    const selector = ".join-btn";
    await this.pageActions.clickBtn(selector);
    console.log("enter meeting event emmited");
    LogManager.createLog({eventName: "entered_meeting", channel: appState.currentChanelName});
  }

  private async clickToJoinMeetingInChanel() {
    const joinRoomBtnSelector = "calling-join-button button";
    await this.page.waitForSelector(joinRoomBtnSelector);

    await this.page.evaluate((selector) => {
      const joinBtn = document.querySelector(selector);
      if (!joinBtn) return;
      joinBtn.click();
    }, joinRoomBtnSelector);
  }

  private async disableCamAndAudio() {
    const selector = "toggle-button button";
    await this.page.waitForSelector(selector);
    await this.page.waitForTimeout(10000);

    await this.page.$$eval(selector, (buttons) => {
      buttons.forEach((btn) => {
        const isPressed = eval(btn.getAttribute("aria-pressed"));
        if (!isPressed) return;
        (btn as any).click();
      });
    });
  }
}
