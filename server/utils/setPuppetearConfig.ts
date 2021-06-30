import puppeteer from 'puppeteer';
import { appState } from '../global/appState';

export async function getConfiguredPuppeteerPage() {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--use-fake-ui-for-media-stream",
        "--use-fake-device-for-media-stream",
      ],
    });
    appState.browser = browser;
    const page = await browser.newPage();
    await page.setViewport({ width: 700, height: 580 });

    return page
}