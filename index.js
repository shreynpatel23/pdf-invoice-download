const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const expressHbs = require("express-handlebars");
const { createPdf, getDownloadAbleFile, generatePdf } = require("./helpers");

const app = express();
const port = 2000;

app.engine(
  "hbs",
  expressHbs({
    layoutsDir: __dirname + "/views",
  })
);
app.set("view engine", "hbs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (_, res) => {
  res.sendFile("index.html");
});

app.post("/downloadPdf", async (req, res) => {
  const { invoice_number, invoice_date, invoice_amount } = req.body;
  if (!invoice_number || !invoice_date || !invoice_amount)
    return res.status(400).send("something went wrong");

  // use this function to generate the pdf and render the html content
  const htmlContent = await generatePdf({
    invoice_number,
    invoice_date,
    invoice_amount,
  });

  // creating the pdf
  await createPdf(`${invoice_number}.pdf`, htmlContent);

  // get the downloadable link and send it as a response
  const { file, stat } = await getDownloadAbleFile(invoice_number);
  res.setHeader("Content-Length", stat.size);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${invoice_number}.pdf`
  );
  res.send(file);
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
