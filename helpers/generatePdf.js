const fs = require("fs");
const path = require("path");
const hbs = require("handlebars");

module.exports = function generatePdf({
  invoice_number,
  invoice_date,
  invoice_amount,
}) {
  const data = { invoice_number, invoice_date, invoice_amount };
  // generating pdf document
  const html = fs.readFileSync(path.join(__dirname, "../views/invoice.hbs"), {
    encoding: "utf-8",
  });
  const template = hbs.compile(html);
  // rendered is the html content to be pushed in pdf
  const rendered = template(data);
  return rendered;
};
