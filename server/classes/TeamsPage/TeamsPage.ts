import * as puppeteer from "puppeteer";
import { RoomService } from "./roomService/RoomService";
import { LoginInfo, LoginService } from "./loginService/LoginService";
import { MeetingService } from "./meetingService/MeetingsService";
import { MeetingLeaveObserver } from "../observerPattern/observerPattern";
import { appState } from "../../global/appState";
import { MeetingDepartureWatcher } from "./meetingService/subclasses/meetingDepartureWatcher";


export class TeamsPage implements MeetingLeaveObserver {
  private roomService: RoomService;
  private meetingService: MeetingService;
  private meetingDepartureWatcher: MeetingDepartureWatcher;
  private readonly URL =
    "https://login.microsoftonline.com/common/oauth2/authorize?response_type=id_token&client_id=5e3ce6c0-2b1f-4285-8d4b-75ee78787346&redirect_uri=https%3A%2F%2Fteams.microsoft.com%2Fgo&state=96dd23aa-5566-47d6-8c5c-d596ea5cee84&client-request-id=72d8942c-b9ad-495e-b455-09182bd346d5&x-client-SKU=Js&x-client-Ver=1.0.9&nonce=98bf753f-0b92-4922-8283-8b74e56d68f3&domain_hint=&sso_reload=true";

  constructor(public page: puppeteer.Page, private loginInfo: LoginInfo) {
    this.roomService = new RoomService(page);
    this.meetingService = new MeetingService(page);
    this.meetingDepartureWatcher = new MeetingDepartureWatcher(
      this.meetingService,
      page
    );

    this.registerObservers();
    this.setEventHandlers();
  }

  public async initTeams(): Promise<void | null> {
    const loginInfo = {
      email: this.loginInfo.email,
      password: this.loginInfo.password,
    };

    const loginService = new LoginService(this.page, loginInfo);

    try {
      await this.page.goto(this.URL);
      appState.isActive = true;
      return loginService.login();
    } catch (err) {
      throw err;
    }
  }

  public async closeTeams(): Promise<void> {
    await appState.browser?.close();
    appState.isActive = false;
    appState.browser = null;
  }

  public async getRoomNames(): Promise<(string | null)[]> {
    return await this.roomService.getRoomNames();
  }

  public async observeRoom(roomName: string): Promise<void> {
    await this.roomService.observe(roomName);
  }

  private registerObservers(): void {
    this.roomService.registerObserver(this.meetingService);
    this.meetingService.joinMeetingService.registerObserver(
      this.meetingDepartureWatcher
    );
    this.meetingService.observeMembersService.leaveMeetingService.registerObserver(
      this
    );
    this.meetingService.observeMembersService.leaveMeetingService.registerObserver(
      this.meetingDepartureWatcher
    );
    this.meetingService.observeMembersService.leaveMeetingService.registerObserver(
      this.meetingService
    );
  }

  private setEventHandlers(): void {
    this.meetingDepartureWatcher.onUnexpectedDepartureFromMeeting =
      this.onMeetingLeave.bind(this);
  }

  public onMeetingLeave(): void {
    console.log("onMeetingLeave called");
    this.roomService.setRoomMutationObserver();
  }
}
