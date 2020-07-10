# Web Scrapper

## Terminal Install Packages:
**npm init -y**
**npm install puppeteer**
**npm i node-fetch --save**

## Terminal Command to run code:
**node scrapers.js**


## Code:
const puppeteer = require('puppeteer');

async function scrapeProject(url){
  const browser = await puppeteer.launch();
  const page    = await browser.newPage();
  await page.goto(url);

#### For an image
   const [el1]  = await page.$x(‘<XPath>’);
   const imgSrc = await el1.getProperty('src');
   const srcTxt = await imgSrc.jsonValue();

#### For text
  const [el2]  = await page.$x(‘<XPath>’);
  const txt    = await el2.getProperty('textContent');
  const rawTxt = await txt.jsonValue();

  console.log({rawTxt});
  browser.close();
}

scrapeProject('https://github.com/ThomasStuart/prework-repo');
