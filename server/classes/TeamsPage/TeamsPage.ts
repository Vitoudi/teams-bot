import * as puppetter from "puppeteer";
import { PageActions } from "./PageActions";
import { RoomService } from "./roomService/RoomService";
import { LoginInfo, LoginService } from "./loginService/LoginService";
import { MeetingService } from "./meetingService/MeetingsService";
import { MeetingLeaveObserver } from "../observerPettern/ObserverPettern";
import { appState } from "../../global/appState";
import { BotState } from "./botState/BotState";
import { Socket } from "socket.io";

export class TeamsPage implements MeetingLeaveObserver {
  url: string;
  isActive: boolean;
  private pageActions: PageActions;
  private roomService: RoomService;
  private meetingService: MeetingService;
  //private botState: BotState 

  constructor(
    public page: puppetter.Page,
    //private socket: Socket,
    private loginInfo: LoginInfo
  ) {
    //this.botState = new BotState(socket)
    this.pageActions = new PageActions(page);
    this.roomService = new RoomService(page);
    this.meetingService = new MeetingService(page);
    this.url =
      "https://login.microsoftonline.com/common/oauth2/authorize?response_type=id_token&client_id=5e3ce6c0-2b1f-4285-8d4b-75ee78787346&redirect_uri=https%3A%2F%2Fteams.microsoft.com%2Fgo&state=96dd23aa-5566-47d6-8c5c-d596ea5cee84&client-request-id=72d8942c-b9ad-495e-b455-09182bd346d5&x-client-SKU=Js&x-client-Ver=1.0.9&nonce=98bf753f-0b92-4922-8283-8b74e56d68f3&domain_hint=&sso_reload=true";

    this.registerObservers();
  }

  public async initTeams() {
    const loginInfo = {
      email: this.loginInfo.email,
      password: this.loginInfo.password,
    }

    const loginService = new LoginService(this.page, loginInfo);

    try {
      await this.page.goto(this.url);
      appState.isActive = true;
      return loginService.login();
    } catch (err) {
      throw err;
    }
  }

  public async getRoomNames() {
    return await this.roomService.getRoomNames();
  }

  public async observeRoom(roomName: string) {
    await this.roomService.observe(roomName);
  }

  private registerObservers() {
    this.roomService.registerObserver(this.meetingService);
    this.meetingService.observeMembersService.leaveMeetingService.registerObserver(
      this
    );
  }

  public onMeetingLeave() {
    console.log("onMeetingLeave called");
    this.roomService.setRoomMutationObserver();
  }
}
