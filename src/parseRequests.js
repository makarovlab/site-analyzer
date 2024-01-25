import puppeteer from 'puppeteer';
import { createObjectCsvWriter } from 'csv-writer';
import { coordinatesClassifier, urlClassifier } from './classifiers.js';

(async () => {
    const contentTypes = ["html", "json", "text"];

    const browser = await puppeteer.launch({"headless": true});
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
  
    const url = 'https://www.avia.at/tanken/tankstellenfinder-diesel-super-95-super-plus-98-biofrei-48638.html'

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
        
        if (urlClassifier(url)) {
            // console.log(`Filtered URL: ${url}`);
            return
        }

        // const content = await response.text();
        const headers = await response.headers();
        const contentType = headers['content-type'] ? headers['content-type'].toLocaleLowerCase() : "";

        if(contentTypes.some((element) => (contentType.includes(element)))) {
            try {
                let responseText = await response.text();
                responseText = responseText.replaceAll("\n", "").replaceAll( "\r", "").replaceAll("\t", "");

                if (coordinatesClassifier(responseText)) {
                    records.push({ url: url, content_type: contentType, text: responseText});
                    console.log(`URL: ${url}`);
                }
            } catch(err) {
                console.log(err.message);
            }
            
        }
    });

    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForTimeout(10000);
    await page.screenshot({path: "screenshot.png", fullPage: true});
    await browser.close();

    csvWriter.writeRecords(records)
        .then(() => {
            console.log('CSV file saved successfully!');
        })
        .catch(error => {
            console.error('Error writing to CSV file:', error);
        });
})();