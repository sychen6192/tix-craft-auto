import { type Page, type Locator } from '@playwright/test';
import { config } from '../config/env.config';

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

    async goto(url: string) {
        console.log(`🌍 前往目標頁面: ${url}`);
        await this.page.goto(url);
    }

    async runCountdown(seconds: string = '0') {
        if (await this.countdownInput.isVisible()) {
            console.log(`⏳ (練習模式) 設定倒數: ${seconds} 秒`);
            await this.countdownInput.fill(seconds);
            await this.startCountdownBtn.click();
        } else {
            console.log('ℹ️ (正式模式) 未偵測到倒數輸入框，直接等待購票按鈕出現...');
        }

        console.log('👀 等待「立即購票」按鈕出現...');
        await this.globalBuyBtn.waitFor({ state: 'visible', timeout: 0 });
        await this.globalBuyBtn.click();

        console.log('✅ 按鈕出現！已點擊！');
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