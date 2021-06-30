import { Page } from "puppeteer";
import { appState } from "../../../global/appState";
import { Field, PageActions } from "../PageActions";

export interface LoginInfo {
  email: string;
  password: string;
}

export class LoginService {
  pageActions: PageActions;

  constructor(private page: Page, private loginInfo: LoginInfo) {
    this.pageActions = new PageActions(page);
  }

  public async login(): Promise<null> {
    return new Promise(async (resolve) => {
      try {
        await this.doConventionalLogin();
      } catch (err) {
        await this.handleUnexpectedLoginStep();
      }

      resolve(null);
    });
  }

  private async doConventionalLogin(): Promise<void> {
    const emailFormBtnSelector = "input[type=submit]";
    const acceptBtnSelector = "#idSIButton9";

    await this.submitEmailForm();
    await this.submitPasswordForm();
    await this.page.waitForSelector(acceptBtnSelector);
    await this.pageActions.clickBtn(emailFormBtnSelector);
    await this.page.waitForNavigation();
    await this.waitForTeamsHomePage();
  }

  private async handleUnexpectedLoginStep(): Promise<void> {
    const skipButtonSelector = '.table[role="button"]';
    await this.page.click(skipButtonSelector);
    await this.page.waitForNavigation();
    await this.waitForTeamsHomePage();
  }

  private async waitForTeamsHomePage(): Promise<void> {
    await this.page.waitForTimeout(10000);
    await this.page.waitForSelector("teams-grid");
    appState.isActive = true;
  }

  private async submitEmailForm(): Promise<void> {
    const emailField: Field = {
      selector: "input[type=email]",
      value: this.loginInfo.email,
    };
    const emailFormBtnSelector = "input[type=submit]";

    await this.pageActions.submitForm(emailField, emailFormBtnSelector);
  }

  private async submitPasswordForm(): Promise<void> {
    const passwordField: Field = {
      selector: "#passwordInput",
      value: this.loginInfo.password,
    };
    const passwordBtnSelector = "#submitButton";

    await this.pageActions.submitForm(passwordField, passwordBtnSelector);
  }
}
