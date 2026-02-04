import { test as setup } from '@e2e/fixtures/base';
import { STORAGE_STATE } from '../../playwright.config';

setup('authenticate', async ({ loginPage, page }) => {
    await loginPage.goto();

    await loginPage.performLogin();

    await page.waitForLoadState('networkidle');

    await page.context().storageState({ path: STORAGE_STATE });
});