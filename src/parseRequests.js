import puppeteer from 'puppeteer';
import { createObjectCsvWriter } from 'csv-writer';

(async () => {
    const contentTypes = ["html", "json", "text"];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    const url = 'https://avoska.ru/shops/'

    const csvWriter = createObjectCsvWriter({
        path: 'data.csv',
        header: [
          { id: 'url', title: 'url' },
          { id: 'content_type', title: 'content_type' },
          { id: 'text', title: 'text' }
        ]
    });
  
    const records = [];

    await page.on('response', async response => {
        
        const url = response.url();
        // const content = await response.text();
        const headers = await response.headers();
        const contentType = headers['content-type'].toLocaleLowerCase();

        if(contentTypes.some((element) => (contentType.includes(element)))) {
            let responseText = await response.text();
            responseText = responseText.replaceAll("\n", "").replaceAll( "\r", "").replaceAll("\t", "");
            records.push({ url: url, content_type: contentType, text: responseText});

            console.log(`URL: ${url}`);
        }
    });

    await page.goto(url, { waitUntil: 'networkidle0' });  
    await browser.close();

    csvWriter.writeRecords(records)
        .then(() => {
            console.log('CSV file saved successfully!');
        })
        .catch(error => {
            console.error('Error writing to CSV file:', error);
        });
})();