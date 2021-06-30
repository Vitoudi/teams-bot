import { Page } from "puppeteer";
import { getTwoThirdsInt } from "../../../../utils/getTwoThirds";
import { PageActions } from "../../PageActions";
import { LeaveMeetingService } from "./LeaveMeetingService";

declare const leaveMeeting: Function;

export class ObserveMembersService {
  private hasExposedNeededFunctions: boolean = false;
  private numberOfTriesToGetNumberOfMembers: number = 5;
  private counterContainerSelector: string = ".participant-counter .text";
  private pageActions: PageActions;
  public leaveMeetingService: LeaveMeetingService;

  constructor(private page: Page) {
    this.pageActions = new PageActions(page);
    this.leaveMeetingService = new LeaveMeetingService(page);
  }

  public async observeMembers(): Promise<void> {
    try {
      await this.pageActions.waitForTimeOutInMinutes(3);
      this.leaveMeetingService.alreadyLeftTheMeeting = false;
      const NUMBER_OF_MEMBERS_TO_LEAVE = await this.getNumberOfMembersToLeave();

      if (!this.hasExposedNeededFunctions) await this.exposeNeededFunctions();

      await this.page.$eval(
        this.counterContainerSelector,
        (counterContainer, NUMBER_OF_MEMBERS_TO_LEAVE) => {
          const observer = new MutationObserver((records) => {
            records.forEach((record) => {
              const str = record.target.textContent;
              if (!str) return;

              const currentNumberOfMembers = +str.replace("+", "");

              const shouldLeave =
                typeof NUMBER_OF_MEMBERS_TO_LEAVE === "number" &&
                currentNumberOfMembers <= NUMBER_OF_MEMBERS_TO_LEAVE;

              if (shouldLeave) leaveMeeting();
            });
          });

          observer.observe(counterContainer, {
            characterData: true,
            subtree: true,
            characterDataOldValue: true,
          });
        },
        NUMBER_OF_MEMBERS_TO_LEAVE
      );
    } catch (err) {
      this.numberOfTriesToGetNumberOfMembers--;

      if (this.numberOfTriesToGetNumberOfMembers > 0) {
        this.observeMembers();
        console.log("trying again");
      } else {
        this.leaveMeetingService.leaveMeeting();
        console.log("leave meeting on error");
      }
    }
  }

  private async openMembersArea(): Promise<void> {
    console.log("open members area called");

    const callingBarSelector = "calling-unified-bar";
    await this.page.waitForSelector(callingBarSelector);

    const showMoreOptionsBtnSelector = "#callingButtons-showMoreBtn";

    await this.pageActions.clickBtn(showMoreOptionsBtnSelector);

    const selector = "#roster-button";
    await this.page.waitForSelector(selector);
    await this.pageActions.clickBtn(selector);
  }

  public resetNumberOfTriesToGetMembers(): void {
    this.numberOfTriesToGetNumberOfMembers = 5;
  }

  private async getNumberOfMembers(): Promise<number | undefined> {
    const selector = this.counterContainerSelector;
    await this.page.waitForSelector(selector);

    return await this.page.$eval(selector, (numberOfMembersContainer) => {
      if (!numberOfMembersContainer) return;
      const num = +numberOfMembersContainer.textContent?.replace("+", "")!;

      return num;
    });
  }

  private async getNumberOfMembersToLeave(): Promise<number> {
    const INITIAL_NUMBER_OF_MEMBERS = await this.getNumberOfMembers();
    console.log("initial: ", INITIAL_NUMBER_OF_MEMBERS);
    return getTwoThirdsInt(INITIAL_NUMBER_OF_MEMBERS as number);
  }

  private async exposeNeededFunctions(): Promise<void> {
    await this.pageActions.exposeFunction(
      "leaveMeeting",
      this.leaveMeetingService.leaveMeeting,
      this.leaveMeetingService
    );

    this.hasExposedNeededFunctions = true;
  }
}

/*
WORKING CODE:

import { Page } from "puppeteer";
import { getTwoThirdsInt } from "../../../../utils/getTwoThirds";
import { PageActions } from "../../PageActions";
import { LeaveMeetingService } from "./LeaveMeetingService";

declare const leaveMeeting: Function;

export class ObserveMembersService {
  private hasExposedNeededFunctions: boolean = false;
  private numberOfTriesToGetNumberOfMembers: number = 5;
  private counterContainerSelector: string = ".participant-counter .text";
  private pageActions: PageActions;
  public leaveMeetingService: LeaveMeetingService;

  constructor(private page: Page) {
    this.pageActions = new PageActions(page);
    this.leaveMeetingService = new LeaveMeetingService(page);
  }

  public async observeMembers(): Promise<void> {
    try {
      await this.pageActions.waitForTimeOutInMinutes(3);
      this.leaveMeetingService.alredyLeftTheMeeting = false;
      const NUMBER_OF_MEMBERS_TO_LEAVE = await this.getNumberOfMembersToLeave();

      if (!this.hasExposedNeededFunctions) await this.exposeNeededFunctions();

      await this.page.$eval(
        this.counterContainerSelector,
        (counterContainer, NUMBER_OF_MEMBERS_TO_LEAVE) => {
          const observer = new MutationObserver((records) => {
            records.forEach((record) => {
              const str = record.target.textContent;
              if (!str) return;

              const currentNumberOfMembers = +str.replace("+", "");

              if (
                currentNumberOfMembers <= (NUMBER_OF_MEMBERS_TO_LEAVE as number)
              )
                leaveMeeting();
            });
          });

          observer.observe(counterContainer, {
            characterData: true,
            subtree: true,
            characterDataOldValue: true,
          });
        },
        NUMBER_OF_MEMBERS_TO_LEAVE
      );
    } catch (err) {
      console.log('catch called')
      this.numberOfTriesToGetNumberOfMembers--;
      if (this.numberOfTriesToGetNumberOfMembers > 0) {this.observeMembers(); console.log("trying again");}
      else {this.leaveMeetingService.leaveMeeting(); console.log('leave metting on error')}
    }
  }

  public resetNumberOfTriesToGetMembers(): void {
    this.numberOfTriesToGetNumberOfMembers = 5;
  }

  private async getNumberOfMembers(): Promise<number | undefined> {
    const selector = this.counterContainerSelector;
    await this.page.waitForSelector(selector);

    return await this.page.$eval(selector, (numberOfMembersContainer) => {
      if (!numberOfMembersContainer) return;
      const num = +numberOfMembersContainer.textContent?.replace("+", "")!;

      return num;
    });
  }

  private async getNumberOfMembersToLeave(): Promise<number> {
    const INITIAL_NUMBER_OF_MEMBERS = await this.getNumberOfMembers();
    console.log("initial: ", INITIAL_NUMBER_OF_MEMBERS);
    return getTwoThirdsInt(INITIAL_NUMBER_OF_MEMBERS as number);
  }

  private async exposeNeededFunctions(): Promise<void> {
    await this.pageActions.exposeFunction(
      "leaveMeeting",
      this.leaveMeetingService.leaveMeeting,
      this.leaveMeetingService
    );

    this.hasExposedNeededFunctions = true;
  }
}
 */
