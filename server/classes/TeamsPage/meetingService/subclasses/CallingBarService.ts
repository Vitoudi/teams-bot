import { Page } from "puppeteer";
import { PageActions } from "../../PageActions";

export class CallingBarService {
  private readonly callingBarSelector = "calling-unified-bar";
  private readonly ShowMoreOptionsBtnSelector = "#callingButtons-showMoreBtn";
  private pageActions: PageActions;

  constructor(private page: Page) {
    this.pageActions = new PageActions(page);
  }

  public async clickCallingBarButton(selector: string) {
    await this.page.waitForSelector(this.callingBarSelector);
    const targetButton = await this.page.$(selector);

    if (!targetButton)
      await this.pageActions.clickBtn(this.ShowMoreOptionsBtnSelector);

    await this.page.waitForSelector(selector);
    await this.pageActions.clickBtn(selector);
  }
}
