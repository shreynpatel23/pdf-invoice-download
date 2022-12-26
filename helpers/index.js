const fs = require("fs");
const chromium = require("chrome-aws-lambda");
const path = require("path");
const hbs = require("handlebars");

function generatePdf({
  invoice_number,
  formatted_date,
  invoice_amount,
  amount_in_words,
  month_name,
  year,
}) {
  const data = {
    invoice_number,
    formatted_date,
    invoice_amount,
    amount_in_words,
    month_name,
    year,
  };
  // generating pdf document
  const html = fs.readFileSync(path.join(__dirname, "../views/invoice.hbs"), {
    encoding: "utf-8",
  });
  const template = hbs.compile(html);
  // rendered is the html content to be pushed in pdf
  const rendered = template(data);
  return rendered;
}

async function createPdf(pdfPath, htmlContent) {
  // open a new browser instance
  const browser = await chromium.puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  // create a new page with the browser instance
  const page = await browser.newPage();

  await page.setContent(htmlContent);
  await page.emulateMediaType("screen");

  await page.pdf({
    path: path.join(__dirname, `../pdfFiles/${pdfPath}`),
    format: "A4",
    printBackground: true,
  });

  await browser.close();
}

async function getDownloadAbleFile({ month_name, year }) {
  const file = fs.readFileSync(
    path.join(__dirname, `../pdfFiles/${month_name}_${year}_invoice.pdf`)
  );
  const stat = fs.statSync(
    path.join(__dirname, `../pdfFiles/${month_name}_${year}_invoice.pdf`)
  );
  return { file, stat };
}

let a = [
  "",
  "one ",
  "two ",
  "three ",
  "four ",
  "five ",
  "six ",
  "seven ",
  "eight ",
  "nine ",
  "ten ",
  "eleven ",
  "twelve ",
  "thirteen ",
  "fourteen ",
  "fifteen ",
  "sixteen ",
  "seventeen ",
  "eighteen ",
  "nineteen ",
];
let b = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

function getAmountInWords(invoice_amount) {
  if ((invoice_amount = invoice_amount.toString()).length > 9)
    return "overflow";
  n = ("000000000" + invoice_amount)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  var str = "";
  str +=
    n[1] != 0
      ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "crore "
      : "";
  str +=
    n[2] != 0
      ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "lakh "
      : "";
  str +=
    n[3] != 0
      ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "thousand "
      : "";
  str +=
    n[4] != 0
      ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "hundred "
      : "";
  str +=
    n[5] != 0
      ? (str != "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
        "only "
      : "";
  return str;
}

function getMonthName(monthIndex) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[monthIndex];
}
module.exports = {
  createPdf,
  getDownloadAbleFile,
  generatePdf,
  getAmountInWords,
  getMonthName,
};
