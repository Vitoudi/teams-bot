import { Page } from "puppeteer";
import { appState } from "../../../global/appState";
import { LogManager } from "../../../models/Logs";
import { UserManager } from "../../../models/User";
import { Field, PageActions } from "../PageActions";

export interface LoginInfo {
    email: string,
    password: string
}

export class LoginService {
  pageActions: PageActions

  constructor(private page: Page, private loginInfo: LoginInfo) {
    this.pageActions = new PageActions(page);
  }

  public async login() {
    return new Promise(async (resolve, reject) => {
      try {
        const emailFormBtnSelector = "input[type=submit]";
        const acceptBtnSelector = '#idSIButton9';
    
        await this.submitEmailForm()
        await this.submitPasswordForm()
        await this.page.waitForSelector(acceptBtnSelector);
        await this.pageActions.clickBtn(emailFormBtnSelector);
        await this.page.waitForNavigation();
        await this.page.waitForTimeout(10000);
        await this.page.waitForSelector("teams-grid");
        appState.isActive = true;
        resolve(null);
      } catch (err) {
        reject(err);
      }
    });
  }

  private conventinalLogin() {
    //TODO
  }

  private async submitEmailForm() {
    const emailField: Field = {
      selector: "input[type=email]",
      value: this.loginInfo.email,
    };
    const emailFormBtnSelector = "input[type=submit]";

     await this.pageActions.submitForm(emailField, emailFormBtnSelector);
  }

  private async submitPasswordForm() {
      const passwordField: Field = {
        selector: "#passwordInput",
        value: this.loginInfo.password,
      };
      const passwordBtnSelector = "#submitButton";

      await this.pageActions.submitForm(passwordField, passwordBtnSelector);
  }
}