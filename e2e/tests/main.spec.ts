import { test } from '@e2e/fixtures/base';
import config from '../../booking-config.json';

const currentEnv = process.env.ENV || 'testing';
const booking = config[currentEnv];

console.log(`🛠️ 目前執行環境: ${currentEnv}`);
console.log(`🎯 目標活動: ${booking.eventKeyword}`);

test('Auto OCR Ticket Flow', async ({ eventPage, areaPage, ticketPage, page }) => {
    await eventPage.goto(booking.url);
    await eventPage.runCountdown(booking.countdown);
    await eventPage.clickEventButton(booking.eventKeyword);
    await areaPage.selectArea(booking.areaKeyword);

    await ticketPage.selectTicket(booking.quantity);
    await ticketPage.checkAgree();

    await ticketPage.submitCaptchaAuto(booking.quantity);
    console.log('🚀 Order Process Finished!');
    await page.waitForTimeout(5000);
});