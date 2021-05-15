import { EventType, Page } from "puppeteer";

export interface Field {
  selector: string;
  value: string;
}

export class PageActions {
  constructor(public page: Page) {}

  public async clickBtn(selector: string) {
    await this.page.click(selector);
  }

  public async fillInput(selector: string, value: string) {
    await this.page.$eval(
      selector,
      (input, email) => {
        (<any>input).value = email;
        const inputEvent = new Event("input", {
          bubbles: false,
          cancelable: false,
        });
        input.dispatchEvent(inputEvent);
      },
      value
    );
  }

  public async submitForm(fields: Field, btnSelector: string) {
    await this.page.waitForSelector(fields.selector)
    await this.fillInput(fields.selector, fields.value);
    await this.clickBtn(btnSelector);
  }

  public async waitForTimeOutInMinutes(minutes: number) {
    const time = minutes * 1000 * 60;
    await this.page.waitForTimeout(time);
  }

  public async exposeFunction(name: string, func: Function, binding?: Object) {
    if (binding) func = func.bind(binding);
    this.page.exposeFunction(name, func);
    return func;
  }

  async simulateEvent(eventName: string, element: HTMLElement) {
    const event = new Event(eventName, { bubbles: true, cancelable: false });
    element.dispatchEvent(event);
  }
}
