import { test } from '@playwright/test';
import { EventPage } from '@e2e/pages/EventPage';
import { AreaPage } from '@e2e/pages/AreaPage';
import { TicketPage } from '@e2e/pages/TicketPage';


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

test('Auto OCR Flow', async ({ page }) => {
    const eventPage = new EventPage(page);
    const areaPage = new AreaPage(page);
    const ticketPage = new TicketPage(page);

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