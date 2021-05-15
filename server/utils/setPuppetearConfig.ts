import * as puppeteer from 'puppeteer';

export async function getConfiguredPuppeteerPage() {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        "--use-fake-ui-for-media-stream",
        "--use-fake-device-for-media-stream",
      ],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 620 });

    return page
}