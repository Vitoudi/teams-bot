import { Page } from "puppeteer";
import { getTwoThirdsInt } from "../../../../utils/getTwoThirds";
import { BotState } from "../../botState/BotState";
import { PageActions } from "../../PageActions";
import { LeaveMeetingService } from "./LeaveMeetingService";

declare const leaveMeeting: Function;

export class ObserveMembersService {
  private counterContainerSelector: string;
  private hasExposedNeededFunctions: boolean;
  private pageActions: PageActions;
  leaveMeetingService: LeaveMeetingService;

  constructor(private page: Page) {
    this.pageActions = new PageActions(page);
    this.hasExposedNeededFunctions = false;
    this.counterContainerSelector = ".participant-counter .text";
    this.leaveMeetingService = new LeaveMeetingService(page);
  }

  public async observeMembers() {
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

            if (currentNumberOfMembers <= (NUMBER_OF_MEMBERS_TO_LEAVE as number))
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
  }

  private async getNumberOfMembers() {
    const selector = this.counterContainerSelector;
    await this.page.waitForSelector(selector);

    return await this.page.$eval(selector, (numberOfMembersContainer) => {
      if (!numberOfMembersContainer) return;
      const num = +numberOfMembersContainer.textContent?.replace("+", "")!;

      return num;
    });
  }

  private async getNumberOfMembersToLeave() {
    const INITIAL_NUMBER_OF_MEMBERS = await this.getNumberOfMembers();
    console.log("initial: ", INITIAL_NUMBER_OF_MEMBERS);
    return getTwoThirdsInt(INITIAL_NUMBER_OF_MEMBERS as number);
  }

  private async exposeNeededFunctions() {
    await this.pageActions.exposeFunction(
      "leaveMeeting",
      this.leaveMeetingService.leaveMeeting,
      this.leaveMeetingService
    );

    this.hasExposedNeededFunctions = true;
  }
}
