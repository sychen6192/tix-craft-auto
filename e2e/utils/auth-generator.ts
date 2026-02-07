import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// 1. 載入隱身插件 (繞過 Facebook 的基本機器人偵測)
chromium.use(stealthPlugin());

// 設定 Cookie 存放路徑
const authDir = path.join(process.cwd(), 'playwright/.auth');
const authFile = path.join(authDir, 'user.json');

async function run() {
    console.log('🚀 正在啟動瀏覽器 (Facebook 登入模式)...');

    // 2. 啟動瀏覽器
    const browser = await chromium.launch({
        headless: false, // 必須開啟視窗讓你登入
        args: [
            '--disable-blink-features=AutomationControlled', // 移除自動化特徵
            '--no-sandbox',
            '--disable-infobars',
            '--start-maximized'
        ]
    });

    const context = await browser.newContext({
        viewport: null,
        // 使用一般的 User Agent，偽裝成正常的 Mac Chrome
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    // 3. 直接前往 Facebook 登入頁 (拓元)
    console.log('🌍 前往拓元 Facebook 登入頁...');
    await page.goto('https://tixcraft.com/login/facebook', { waitUntil: 'domcontentloaded' });

    // 4. 等待使用者手動登入
    console.log('\n' + '='.repeat(50));
    console.log('⚠️  請在跳出的視窗中「手動」登入 Facebook');
    console.log('✅  當你看到拓元首頁 (代表登入成功) 後，請回到這裡按下 [Enter] 鍵');
    console.log('='.repeat(50) + '\n');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    await new Promise<void>(resolve => {
        rl.question('👉 登入完成了嗎？請按 [Enter] 存檔...', () => {
            rl.close();
            resolve();
        });
    });

    // 5. 存檔
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    await context.storageState({ path: authFile });

    console.log(`\n💾 Session 已儲存至: ${authFile}`);
    console.log('🎉 搞定！下次跑測試就會自動用這個 Facebook 帳號了。');

    await browser.close();
}

run().catch(error => {
    console.error('❌ 發生錯誤:', error);
    process.exit(1);
});