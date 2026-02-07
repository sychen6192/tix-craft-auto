import { test as base } from '@playwright/test';
import { EventPage } from '@e2e/pages/EventPage';
import { AreaPage } from '@e2e/pages/AreaPage';
import { TicketPage } from '@e2e/pages/TicketPage';

type MyFixtures = {
    eventPage: EventPage;
    areaPage: AreaPage;
    ticketPage: TicketPage;
};

export const test = base.extend<MyFixtures>({
    eventPage: async ({ page }, use) => {
        await use(new EventPage(page));
    },
    areaPage: async ({ page }, use) => {
        await use(new AreaPage(page));
    },
    ticketPage: async ({ page }, use) => {
        await use(new TicketPage(page));
    },
});

export { expect } from '@playwright/test';