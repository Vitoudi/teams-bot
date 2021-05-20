import { Page } from "puppeteer";
import { RoomObserver, Subject } from "../../observerPettern/ObserverPettern";
import { PageActions } from "../PageActions";

declare const notifyRoomObservers: Function;

export class RoomService implements Subject<RoomObserver> {
  observers: RoomObserver[];
  hasExposedNotifyRoomObserversFunction: boolean;
  private chanelsListSelector: string;
  private activeCallSelector: string;

  constructor(private page: Page) {
    this.chanelsListSelector = "ul.school-app-team-channel";
    this.activeCallSelector = "span.ts-active-calls-counter";
    this.observers = [];
    this.hasExposedNotifyRoomObserversFunction = false;
  }

  public async observe(roomName: string) {
    if (!this.hasExposedNotifyRoomObserversFunction) {
      this.exposeNotifyRoomObserversFunction();
    }

    const selector = this.chanelsListSelector;
    await this.enterRoom(roomName);
    await this.page.waitForSelector(selector);

    await this.checkInProgressMeetings();

    await this.setRoomMutationObserver();
  }

  public async setRoomMutationObserver() {
    const selector = `ul.school-app-team-channel`;
    const meetingInProgressSelector = "span.ts-active-calls-counter";
    const meetingInProgressClassName = meetingInProgressSelector.split(".")[1];

    try {
      await this.page.waitForSelector(selector);

      await this.page.$eval(
        selector,
        (element, targetToObserve) => {
          const observer = new MutationObserver((records, obs) => {
            records.forEach((record) => {
              const matchSelector = (record.target as any).classList.contains(
                targetToObserve
              );

              if (matchSelector) {
                record.target?.parentElement?.click();
                notifyRoomObservers();
              }
            });
          });

          observer.observe(element, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
          });
        },
        meetingInProgressClassName
      );
    } catch {
      this.handleEnexpctedScreenAfterLeaveMeeting()
    }
  }

  private async handleEnexpctedScreenAfterLeaveMeeting() {
    const selector = ".ts-btn";
    await this.page.click(selector);
    this.setRoomMutationObserver();
  }

  private async checkInProgressMeetings() {
    console.log("check in progress meetings called");

    await this.page.evaluate((activeCallSelector) => {
      const activeCall = document.querySelector(activeCallSelector);
      if (!activeCall) return;

      activeCall.parentElement.click();
      notifyRoomObservers();
    }, this.activeCallSelector);
  }

  private async enterRoom(roomName: string) {
    return await this.page.$$eval(
      ".team-name-text",
      (elements, roomName) => {
        const room = elements.filter((el) => el.textContent === roomName)[0];
        (<any>room).click();
      },
      roomName
    );
  }

  public async getRoomNames() {
    return await this.page.$$eval(".team-name-text", (elements) => {
      return elements.map((el) => el.textContent);
    });
  }

  public notifyObservers() {
    this.observers.forEach((o) => {
      o.onNewMeeting();
    });
  }

  public registerObserver(observer: RoomObserver) {
    this.observers.push(observer);
  }

  private async exposeNotifyRoomObserversFunction() {
    const notifyRoomObservers = this.notifyObservers.bind(this);
    await this.page.exposeFunction("notifyRoomObservers", notifyRoomObservers);
    this.hasExposedNotifyRoomObserversFunction = true;
  }
}
