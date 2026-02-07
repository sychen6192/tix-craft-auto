import { test } from '@e2e/fixtures/base';

interface BookingConfig {
    countdown: string;
    eventKeyword: string;
    areaName: string;
    quantity: number;
}

const myBooking: BookingConfig = {
    countdown: '1',
    eventKeyword: 'G.E.M.鄧紫棋 I AM GLORIA',
    areaName: 'B2層002區 6880',
    quantity: 1
};

test.use({ storageState: { cookies: [], origins: [] } });

test('Auto OCR Ticket Flow', async ({ eventPage, areaPage, ticketPage, page }) => {
    await eventPage.goto();
    await eventPage.runCountdown(myBooking.countdown);
    await eventPage.clickEventButton(myBooking.eventKeyword);
    await areaPage.selectArea(myBooking.areaName);

    await ticketPage.selectTicket(myBooking.quantity);
    await ticketPage.checkAgree();

    await ticketPage.submitCaptchaAuto(myBooking.quantity);

    console.log('🚀 Order Process Finished!');
    await page.waitForTimeout(5000);
});