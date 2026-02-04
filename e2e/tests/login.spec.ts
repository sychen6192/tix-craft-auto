import { test, chromium } from '@playwright/test';

test('使用 Network Cookie 字串登入', async () => {

    // 1. 這裡貼上你剛剛從 Network 面板「Copy value」的那一大串字串
    // 它長得像這樣: "PHPSESSID=abcd12345; SID=xyz98765; ..."
    const rawCookie = `BID=RMEjrhDDOEq09MkbMVURRCR-wUFFMUZ3finnybeBsjTM9GoUuDQcN7vcMqduVPDlO0TIW6kEL_ddeleU; eps_sid=18dfae4e878ca92d.1768638094.bPmOhru6uu8+28hX2iKyG72N20zemuiy+g/8pZ6EKoc=; OptanonConsent=isGpcEnabled=1&datestamp=Sat+Jan+24+2026+18%3A20%3A37+GMT%2B0800+(Taiwan+Standard+Time)&version=202506.1.0&browserGpcFlag=1&isIABGlobal=false&hosts=&consentId=0e1853ad-0966-4a50-a0ed-d4f2ff162699&interactionCount=1&isAnonUser=1&landingPath=NotLandingPage&groups=C0001%3A1%2CC0003%3A0%2CC0002%3A0%2CC0004%3A0&AwaitingReconsent=false; tmpt=0:bea96e8409000000:1769248198434:7d61070c:357992b85b4e69af1f9919138f93ad9c:60df67cdcb3f6b1acf3b14d434490df188e49e88e7fc78dc5bc3990030be5fbc; _csrf=21bb3bf806bbbe533258c4f950ae955746357fc69974b20b15030b81b814700ca%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%222tnNXPLVeOmX-WLQEGSThf3vDkYkswiM%22%3B%7D; TIXUISID=naq6kurj6e8ab292h0jbtft5td`;

    // --- 以下是自動轉換邏輯，完全不用動 ---
    const cookieArray = rawCookie.split(';').map(pair => {
        const [name, value] = pair.trim().split('=');
        return {
            name: name,
            value: value,
            domain: '.tixcraft.com', // 幫你預設好網域
            path: '/',
            httpOnly: true, // 假設都是重要的
            secure: true
        };
    });
    // -------------------------------------

    const browser = await chromium.launch({
        headless: false,
        channel: 'chrome',
        args: ['--disable-blink-features=AutomationControlled']
    });

    // 記得這裡還是要填 User-Agent
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });

    // 自動注入轉換好的 Cookie
    await context.addCookies(cookieArray);

    const page = await context.newPage();

    console.log('🔵 正在嘗試使用 Cookie 登入...');
    await page.goto('https://tixcraft.com/');

    // 檢查是否成功
    await page.pause();
});