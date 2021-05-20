import { Page } from "puppeteer";
import { appState } from "../../../../global/appState";
import { LogManager } from "../../../../models/Logs";
import { PageActions } from "../../PageActions";

declare const writeAndSendMsg: Function;
declare const setAlreadySendMsg: Function;
declare const emit: Function;

export class ChatService {
  alreadySendMsg: boolean;
  hasExposedFunctions: boolean;
  private pageActions: PageActions;

  constructor(private page: Page) {
    this.alreadySendMsg = false;
    this.pageActions = new PageActions(page)
  }

  private async openChat() {
    const selector = "#chat-button";
    await this.page.waitForSelector(selector);
    await this.pageActions.clickBtn(selector);
  }

  private async writeInChat(text: string) {
    const selector = ".cke_wysiwyg_div div";
    await this.page.waitForSelector(selector);

    await this.page.$eval(
      selector,
      (chatInput, text) => {
        function simulateEvent(eventName, element) {
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
    console.log("click");
  }

  public async writeAndSendMsg(msg: string) {
    if (this.alreadySendMsg) return;

    LogManager.createLog({ eventName: "chat_msg_sent", channel: appState.currentChanelName });

    console.log("- - msg_sent - -");
    await this.writeInChat(msg);
    await this.sendMsg();
  }

  public async observeChat() {
    await this.openChat();

    const selector = ".list-wrap";

    if (!this.hasExposedFunctions) {
      await this.exposeFunctions();
    }

    await this.page.$eval(
      selector,
      (element, chanelName) => {
        const observer = new MutationObserver((records) => {
          records.forEach((record) => {
            const addedNodes = record.addedNodes;

            addedNodes.forEach((node) => {
              const msgContent = node.textContent.toLocaleLowerCase();
              if (msgContent.length >= 22 || !msgContent) return;

              if (msgContent.includes("presente")) {
                console.log("includes presente!");
                writeAndSendMsg("presente");
                setAlreadySendMsg(true);
              }
            });
          });
        });

        observer.observe(element, {
          childList: true,
          subtree: true,
        });
      },
      appState.currentChanelName
    );
  }

  private setAlreadySendMsg(value: boolean) {
    this.alreadySendMsg = value;
  }

  private async exposeFunctions() {
    await this.pageActions.exposeFunction(
      "writeAndSendMsg",
      this.writeAndSendMsg,
      this
    );

    await this.pageActions.exposeFunction(
      "setAlreadySendMsg",
      this.setAlreadySendMsg,
      this
    );

    this.hasExposedFunctions = true;
  }
}
