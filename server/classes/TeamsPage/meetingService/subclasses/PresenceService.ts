import { Page } from "puppeteer";
import { appState } from "../../../../global/appState";
import { LogManager } from "../../../../models/Logs";
import { PageActions } from "../../PageActions";
import { ChatService } from "./ChatService";

declare const sendPresenceMsg: Function;

export class PresenceService {
  private pageActions: PageActions;
  private readonly presenceMsg = "presente";
  private hasExposedNeededFunctions = false;
  public alreadySentPresenceMsg = false;

  constructor(private chatService: ChatService, private page: Page) {
    this.pageActions = new PageActions(page);
  }

  public async observeChatForPresence(): Promise<void> {
    await this.chatService.openChat();

    const selector = ".list-wrap";

    if (!this.hasExposedNeededFunctions) await this.exposeNeededFunctions();

    await this.page.$eval(
      selector,
      (element, presenceMsg) => {
        const observer = new MutationObserver((records) => {
          records.forEach((record) => {
            const addedNodes = record.addedNodes;

            addedNodes.forEach((node) => {
              const msgContent = node?.textContent?.toLocaleLowerCase();
              const MAX_LENGTH_FOR_MSG = 22;

              if (!msgContent || msgContent?.length >= MAX_LENGTH_FOR_MSG)
                return;

              if (msgContent.includes(presenceMsg as string)) sendPresenceMsg();
            });
          });
        });

        observer.observe(element, {
          childList: true,
          subtree: true,
        });
      },
      this.presenceMsg
    );
  }

  private async sendPresenceMsg(): Promise<void> {
    if (this.alreadySentPresenceMsg) return;
    await this.chatService.writeAndSendMsg(this.presenceMsg);
    LogManager.createLog({
      eventName: "chat_msg_sent",
      channel: appState.currentChannelName,
    });
    this.alreadySentPresenceMsg = true;
  }

  private async exposeNeededFunctions(): Promise<void> {
    await this.pageActions.exposeFunction(
      "sendPresenceMsg",
      this.sendPresenceMsg,
      this
    );

    this.hasExposedNeededFunctions = true;
  }
}
