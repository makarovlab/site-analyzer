import fs from 'fs';
import puppeteer from 'puppeteer';


async function takeScreenshot(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(5000);
  
    // Take a screenshot
    await page.screenshot({ path: `screenshots/${encodeURIComponent(url)}.png`, fullPage: true});
  
    // Close the browser
    await browser.close();
}

const filePath = './sample_urls.txt';
const urls = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);


async function processURLs() {
    for (const url of urls) {
      try {
        console.log(`Processing: ${url}`);
        await takeScreenshot(url);
        console.log(`Screenshot taken for: ${url}`);
      } catch (error) {
        console.error(`Error processing ${url}: ${error.message}`);
      }
    }
}
  
// Start processing URLs
processURLs();
