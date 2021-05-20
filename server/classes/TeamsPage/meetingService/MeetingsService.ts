import { Page } from "puppeteer";
import { appState } from "../../../global/appState";
import {
  RoomAndMeetingLeaveObserver,
  RoomObserver,
} from "../../observerPettern/ObserverPettern";
import { PageActions } from "../PageActions";
import { ChatService } from "./subclasses/ChatService";
import { ObserveMembersService } from "./subclasses/ObserveMembersService";
import { JoinMeetingService } from "./subclasses/JoinMeetingService";

export class MeetingService implements RoomObserver {
  private chatService: ChatService;
  private joinMeetingService: JoinMeetingService;
  private pageActions: PageActions
  observeMembersService: ObserveMembersService;

  constructor(private page: Page) {
    this.pageActions = new PageActions(page)
    this.chatService = new ChatService(page);
    this.joinMeetingService = new JoinMeetingService(page);
    this.observeMembersService = new ObserveMembersService(page);
  }

  private async startMeetingCycle() {
    await this.pageActions.waitForTimeOutInMinutes(1.5);

    await this.joinMeetingService.joinMeeting();
    await this.chatService.observeChat();
    await this.observeMembersService.observeMembers();
  }

  private async getChanelName() {
    const selector = ".channel-name";
    const chanelName = await this.page.$eval(
      selector,
      (element) => element.textContent
    );

    return chanelName;
  }

  public async onNewMeeting() {
    const chanelName = await this.getChanelName();
    appState.currentChanelName = chanelName;

    this.startMeetingCycle();
  }
}
