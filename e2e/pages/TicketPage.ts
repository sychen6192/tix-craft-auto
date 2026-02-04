import { type Page, type Locator } from '@playwright/test';
import axios from 'axios';

export class TicketPage {
    readonly page: Page;
    readonly ticketSelector: Locator;
    readonly captchaInput: Locator;
    readonly captchaImg: Locator;
    readonly agreeCheckbox: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Selects the first dropdown for ticket quantity
        this.ticketSelector = page.getByRole('combobox').first();
        this.captchaInput = page.getByRole('textbox', { name: '請輸入驗證碼' });
        this.captchaImg = page.locator('#captcha-image');
        this.agreeCheckbox = page.getByRole('checkbox', { name: /我已詳細閱讀/ });
        this.submitButton = page.getByRole('button', { name: '確認張數' });
    }

    /**
     * Selects the ticket area and quantity.
     */
    async selectTicket(quantity: number) {
        const ticketPriceRow = this.page.locator('.ticket-price, tr').filter({ hasText: /TWD|\$/ }).first();
        if (await ticketPriceRow.isVisible()) {
            await ticketPriceRow.click();
        }
        await this.ticketSelector.waitFor({ state: 'visible' });
        await this.ticketSelector.selectOption(quantity.toString());
    }

    /**
     * Ensures the Terms of Service checkbox is checked.
     */
    async checkAgree() {
        await this.agreeCheckbox.waitFor({ state: 'visible' });
        if (!(await this.agreeCheckbox.isChecked())) {
            await this.agreeCheckbox.check();
        }
    }

    /**
     * Captures the captcha image and sends it to the OCR server.
     */
    async getOcrCode(): Promise<string> {
        try {
            const buffer = await this.captchaImg.screenshot();
            const base64Image = buffer.toString('base64');

            const response = await axios.post('http://127.0.0.1:8888/solve', {
                image: base64Image
            });

            const code = response.data.code;
            console.log(`🤖 OCR result: ${code}`);
            return code;
        } catch (error) {
            console.error('❌ OCR Server Connection Failed:', error);
            return '';
        }
    }

    /**
     * Main loop for automated captcha submission and error recovery.
     */
    async submitCaptchaAuto(quantity: number) {
        console.log(`⚡ Starting Auto-Buy Mode (Target: ${quantity} tickets)...`);

        let alertTriggered = false;

        // Listen for browser dialogs (alerts usually trigger on wrong captcha or sold out)
        this.page.on('dialog', async (dialog) => {
            console.log(`🚨 Alert detected: "${dialog.message()}"`);
            alertTriggered = true;
            await dialog.accept();
        });

        // Infinite retry loop
        while (true) {
            alertTriggered = false;

            // 1. Fetch OCR Result
            let code = await this.getOcrCode();

            // Simple validation: If OCR returns anything other than 4 characters, refresh and retry
            if (!code || code.length !== 4) {
                console.log(`⚠️ Invalid code length (${code}), refreshing captcha...`);
                await this.captchaImg.click();
                await this.page.waitForTimeout(500);
                continue;
            }

            // 2. Fill and Submit
            await this.captchaInput.clear();
            await this.captchaInput.fill(code);
            await this.submitButton.click();

            // Wait briefly for potential alerts to fire
            await this.page.waitForTimeout(800);

            // 3. Result Evaluation
            if (alertTriggered) {
                console.log('🔄 Failure recovery: Re-selecting quantity and terms...');

                // After an alert, form fields often reset
                await this.selectTicket(quantity);
                await this.checkAgree();

                // Manually refresh captcha image to be safe
                await this.captchaImg.click();
                await this.page.waitForTimeout(500);
            } else {
                try {
                    // Check if URL changed (indicates success/navigation to next step)
                    await this.page.waitForURL((url) => url.href !== this.page.url(), { timeout: 2000 });
                    console.log('🎉 Success! Navigated to the next page.');
                    break;
                } catch (e) {
                    // If URL hasn't changed, check if the input is still visible
                    if (await this.captchaInput.isVisible()) {
                        console.log('❓ No response/navigation. Retrying same page...');
                        continue;
                    } else {
                        console.log('🎉 Input hidden. Assuming success!');
                        break;
                    }
                }
            }
        }
    }
}