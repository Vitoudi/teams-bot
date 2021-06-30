import { Page } from "puppeteer";
import { PageActions } from "../../PageActions";
import { CallingBarService } from './CallingBarService';

export class ChatService {
  private pageActions: PageActions;

  constructor(
    private callingBarService: CallingBarService,
    private page: Page
  ) {
    this.pageActions = new PageActions(page);
  }

  public async openChat() {
    const chatBtnSelector = "#chat-button";
    await this.callingBarService.clickCallingBarButton(chatBtnSelector);
    await this.pageActions.waitForTimeOutInMinutes(0.5);
  }

  public async writeAndSendMsg(msg: string) {
    console.log("- - msg_sent - -");
    await this.writeInChat(msg);
    await this.sendMsg();
  }

  private async writeInChat(text: string) {
    const selector = ".cke_wysiwyg_div div";
    await this.page.waitForSelector(selector);

    await this.page.$eval(
      selector,
      (chatInput, text) => {
        function simulateEvent(eventName: string, element: any) {
          const event = new Event(eventName, {
            bubbles: true,
            cancelable: false,
          });
          element.dispatchEvent(event);
        }

        simulateEvent("change", chatInput);
        chatInput.textContent = text as string;
      },
      text
    );
  }

  private async sendMsg() {
    const selector = "#send-message-button";
    await this.page.waitForTimeout(5000);
    await this.page.$eval(selector, (btn) => (btn as any).click());
  }
}
