import { Page } from "puppeteer";
import { appState } from "../../../global/appState";
import { ChatService } from "../meetingService/subclasses/ChatService";

export class GreetingService {
  private readonly greetingList = [
    "História",
    "Geografia",
    "Filosofia",
    "Arte",
    "Língua Portuguesa",
  ];
  private readonly greetingMsg = "Bom dia, prof!";
  private readonly waitingTimeToSendGreetingMsg = 30 * 1000;

  constructor(private chatService: ChatService) {}

  public checkGreeting(): void {
    if (this.isInGreetingChannel()) this.sendGreeting();
  }

  private async sendGreeting(): Promise<void> {
    console.log("send greeting called");
    await this.waitToSendGreeting();
    this.chatService.writeAndSendMsg(this.greetingMsg);
  }

  private isInGreetingChannel(): boolean {
    const currentChannel = appState.currentChannelName;
    return this.greetingList.includes(currentChannel);
  }

  private waitToSendGreeting(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, this.waitingTimeToSendGreetingMsg);
    });
  }
}
