const { test, expect } = require('@playwright/test');
const { NlpManager } = require('node-nlp');

const topPageUrl = 'https://xerosbaseball.github.io/terms/';
const manager = new NlpManager({ languages: ['en'] });

async function gotoWithRetries(page, url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const response = await page.goto(url);
    if (response) return response;
    console.warn(`Retrying to load ${url}, attempt ${i + 1}`);
  }
  return null;
}

test('Check link titles and content consistency', async ({ page }) => {
  await page.goto(topPageUrl);

  // サイドバーのリンクを取得
  const sidebarLinks = await page.$$eval('aside a', anchors =>
    anchors.map(a => ({ href: a.href, title: a.innerText.trim() }))
  );

  for (const { href, title } of sidebarLinks) {
    console.log(`Checking link: ${href} with title: ${title}`);

    const response = await gotoWithRetries(page, href);

    if (response) {
      expect(response.status()).toBe(200);

      const pageTitle = await page.title();
      console.log(`Page title: ${pageTitle}`);

      // タイトルが一致しているかをチェック（ケースインセンシティブで比較）
      expect(pageTitle.toLowerCase()).toContain(title.toLowerCase());

      const content = await page.content();
      const result = await manager.process('en', content);

      // タイトルがページ内容に含まれているかをチェック
      const isConsistent = result.intent.includes(title.toLowerCase());
      expect(isConsistent).toBe(true);

      await page.goto(topPageUrl);
    } else {
      console.error(`Failed to load ${href}`);
    }
  }
});
