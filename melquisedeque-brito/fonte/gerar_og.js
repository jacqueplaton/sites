// Gera fonte/assets/img/og.jpg a partir de fonte/og.html (precisa do Playwright).
// Uso: node fonte/gerar_og.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('file://' + path.join(__dirname, 'og.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(__dirname, 'assets/img/og.jpg'), type: 'jpeg', quality: 86 });
  await b.close();
  console.log('fonte/assets/img/og.jpg');
})();
