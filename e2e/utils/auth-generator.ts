import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';

chromium.use(stealthPlugin());

const authFile = path.join(__dirname, '../../playwright/.auth/user.json');

async function globalSetup() {
    const authDir = path.dirname(authFile);
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    const browser = await chromium.launch({
        headless: false,
        channel: 'chrome',
        args: [
            '--disable-blink-features=AutomationControlled',
            '--use-fake-ui-for-media-stream',
            '--window-size=1920,1080',
            '--no-sandbox'
        ]
    });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    }); const page = await context.newPage();

    console.log('🔵 正在前往拓元 Google 登入頁面...');

    await page.goto('https://tixcraft.com/login/google');

    console.log('--------------------------------------------------');
    console.log('🟡 請在彈出的瀏覽器中：');
    console.log('   1. 輸入 Google 帳號密碼');
    console.log('   2. 完成手機驗證 (如有)');
    console.log('   3. 等待網頁自動跳轉回拓元首頁');
    console.log('⏳ 腳本正在監聽 URL 變化...');
    console.log('--------------------------------------------------');

    await page.waitForURL((url) => {
        return url.href === 'https://tixcraft.com/' || url.href === 'https://tixcraft.com';
    }, { timeout: 0 });

    console.log('🟢 偵測到已跳轉回首頁！正在擷取 Cookies...');

    await page.context().storageState({ path: authFile });

    console.log(`✅ Auth 檔案已成功建立於: ${authFile}`);
    console.log('🚀 現在你可以執行測試了！');

    await browser.close();
}

globalSetup();