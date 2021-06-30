import { Page } from "puppeteer";
import { MeetingJoinObserver, MeetingLeaveObserver } from "../../../observerPattern/observerPattern";
import { MeetingService } from "../MeetingsService";

export class MeetingDepartureWatcher implements MeetingJoinObserver, MeetingLeaveObserver {
  private isWatching = false;
  private timeToVerify = 5 * 1000 * 60;

  constructor(private meetingService: MeetingService, private page: Page) {}

  public onUnexpectedDepartureFromMeeting = () => {};

  public startWatching(): void {
    console.log("meeting service: ", typeof this.meetingService);
    console.log('start watching called');
    setTimeout(this.verify, this.timeToVerify);
  }

  private async verify(): Promise<void | null> {
    console.log('verify departure called');
    if (!this.meetingService?.isOnMeeting || !this.isWatching) return;

    const pageHasHangupButton = await this.pageHasHangupButton();

    if (pageHasHangupButton) {
      this.startWatching();
      return;
    }

    this.meetingService.isOnMeeting = false;
    this.onUnexpectedDepartureFromMeeting();
  }

  private async pageHasHangupButton(): Promise<boolean> {
    const selector = "hangup-button";
    const hangupButton = await this.page.$(selector);
    const hasHangupButtonInPage = Boolean(hangupButton);

    return hasHangupButtonInPage;
  }

  public onJoinMeeting(): void {
    this.isWatching = true;
    this.startWatching();
  }

  public onMeetingLeave(): void {
    this.isWatching = false;
  }
}
