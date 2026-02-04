import { type Page, type Locator } from '@playwright/test';

export class EventPage {
    readonly page: Page;
    readonly countdownInput: Locator;
    readonly startCountdownBtn: Locator;
    readonly globalBuyBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.countdownInput = page.getByPlaceholder('請輸入倒數秒數');
        this.startCountdownBtn = page.getByRole('button', { name: '開始倒數計時' });
        this.globalBuyBtn = page.getByRole('button', { name: '立即購票' });
    }

    async goto() {
        await this.page.goto('https://ticket-training.onrender.com/');
        // await this.page.goto('https://tixcraft.com/');

    }

    async runCountdown(seconds: string = '1') {
        console.log(`⏳ Setting countdown to: ${seconds} seconds`);
        await this.countdownInput.fill(seconds);
        await this.startCountdownBtn.click();

        console.log('👀 Waiting for countdown to finish...');
        await this.globalBuyBtn.waitFor({ state: 'visible', timeout: 10000 });
        await this.globalBuyBtn.click();

        console.log('✅ Countdown finished. Global "Buy Tickets" button clicked!');
    }

    async clickEventButton(keyword: string) {
        // Locates the specific row containing the keyword (e.g., event name or date)
        const row = this.page.locator('tr').filter({ hasText: keyword }).first();

        // Searches for the purchase button within that specific row
        const eventBtn = row.locator('button, a').filter({ hasText: /立即訂購|立即購票/ }).first();

        await eventBtn.waitFor({ state: 'visible' });
        await eventBtn.click();
        console.log(`👉 Clicked the "Order" button for event: "${keyword}"`);
    }
}