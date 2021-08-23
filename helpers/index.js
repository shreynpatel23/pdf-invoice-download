const fs = require("fs");
const puppeteer = require("puppeteer");

async function createPdf(pdfPath, htmlContent) {
  // open a new browser instance
  const browser = await puppeteer.launch();
  // create a new page with the browser instance
  const page = await browser.newPage();

  await page.setContent(htmlContent);
  await page.emulateMediaType("print");

  await page.pdf({ path: `./pdfFiles/${pdfPath}`, format: "A4" });

  await browser.close();
}

async function getDownloadAbleFile(invoice_number) {
  const file = fs.readFileSync(`./pdfFiles/${invoice_number}.pdf`);
  const stat = fs.statSync(`./pdfFiles/${invoice_number}.pdf`);
  return { file, stat };
}

module.exports = { createPdf, getDownloadAbleFile };
