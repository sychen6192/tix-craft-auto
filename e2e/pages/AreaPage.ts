import { type Page, type Locator } from '@playwright/test';

export class AreaPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async selectArea(keyword: string) {
        console.log(`🔍 Searching for area containing "${keyword}"...`);

        const area = this.page.getByText(keyword).first();

        await area.waitFor({ state: 'visible', timeout: 5000 });
        console.log(`👉 Clicking area: ${await area.innerText()}`);
        await area.click();
    }
}