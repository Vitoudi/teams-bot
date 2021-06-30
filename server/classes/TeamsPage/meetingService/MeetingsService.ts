import { Page } from "puppeteer";
import { appState } from "../../../global/appState";
import {
  MeetingLeaveObserver,
  RoomObserver,
} from "../../observerPattern/observerPattern";
import { PageActions } from "../PageActions";
import { ChatService } from "./subclasses/ChatService";
import { ObserveMembersService } from "./subclasses/ObserveMembersService";
import { JoinMeetingService } from "./subclasses/JoinMeetingService";
import { GreetingService } from "../greetingService/GreetingService";
import { PresenceService } from "./subclasses/PresenceService";
import { CallingBarService } from "./subclasses/CallingBarService";

export class MeetingService implements RoomObserver, MeetingLeaveObserver {
  private presenceService: PresenceService;
  private pageActions: PageActions;
  private greetingService: GreetingService;
  public readonly joinMeetingService: JoinMeetingService;
  public readonly observeMembersService: ObserveMembersService;
  public isOnMeeting = false;

  constructor(private page: Page) {
    const callingBarService = new CallingBarService(page);
    const chatService = new ChatService(callingBarService, page);

    this.pageActions = new PageActions(page);
    this.presenceService = new PresenceService(chatService, page);
    this.joinMeetingService = new JoinMeetingService(page);
    this.observeMembersService = new ObserveMembersService(page);
    this.greetingService = new GreetingService(chatService);
  }

  private async startMeetingCycle() {
    await this.pageActions.waitForTimeOutInMinutes(1.5);

    await this.joinMeetingService.joinMeeting();
    await this.presenceService.observeChatForPresence();
    this.greetingService.checkGreeting();
    await this.observeMembersService.observeMembers();
    this.isOnMeeting = true;
  }

  private async getChannelName() {
    const selector = ".channel-name";
    const chanelName = await this.page.$eval(
      selector,
      (element) => element?.textContent
    );

    return chanelName;
  }

  public async onNewMeeting() {
    const chanelName = await this.getChannelName();
    appState.currentChannelName = chanelName || "";

    await this.startMeetingCycle();
  }

  public onMeetingLeave() {
    this.observeMembersService.resetNumberOfTriesToGetMembers();
    this.presenceService.alreadySentPresenceMsg = false;
    this.isOnMeeting = false;
  }
}
