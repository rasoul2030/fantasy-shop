// Script to take a screenshot using Playwright
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  
  try {
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000); // Wait for client-side hydration
    
    // Take main screenshot
    await page.screenshot({ path: '/home/z/my-project/download/fantasy-shop-main.png', fullPage: false });
    console.log('Main screenshot saved!');
    
    // Full page screenshot
    await page.screenshot({ path: '/home/z/my-project/download/fantasy-shop-full.png', fullPage: true });
    console.log('Full page screenshot saved!');
    
  } catch (err) {
    console.error('Error:', err.message);
  }
  
  await browser.close();
})();
