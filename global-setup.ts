import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    console.log('正在前往拓元登入頁面...');

    await page.goto('https://tixcraft.com/');

    console.log('⚠️ 請注意！瀏覽器開啟後，請務必在視窗中進行以下動作：');
    console.log('1. 點擊右上角登入');
    console.log('2. 選擇 FB 或 Google 登入');
    console.log('3. 輸入你的帳號密碼完成登入');
    console.log('4. 等到畫面跳轉回拓元首頁，且右上角顯示你的帳號');

    await page.waitForURL('https://tixcraft.com/', { timeout: 60000 });

    await page.waitForTimeout(3000);

    // 4. 儲存狀態 (Save State)
    // 這行程式碼會把你現在瀏覽器的所有 Cookies 和 LocalStorage 存成一個檔案
    await page.context().storageState({ path: 'auth.json' });

    console.log('✅ 登入狀態已保存至 auth.json');

    await browser.close();
}

export default globalSetup;