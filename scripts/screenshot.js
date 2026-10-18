import subprocess
import sys

# Use playwright to take screenshot
code = """
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: '/home/z/my-project/download/fantasy-shop-preview.png', fullPage: false });
  console.log('Screenshot saved!');
  await browser.close();
})();
"""

result = subprocess.run(
    ['node', '-e', code],
    capture_output=True, text=True, timeout=60
)
print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr)
print("Return code:", result.returncode)
