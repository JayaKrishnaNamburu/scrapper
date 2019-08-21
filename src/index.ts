import express from "express";
import bodyParser from "body-parser";
import "./db";
import { scrapeMoneyDonated } from "./scraper";

const port = process.env.PORT || 8080;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "2mb" }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/opencollective-count", async (req, res) => {
  const money = await scrapeMoneyDonated();
  res.json({ donated: money });
});

app.get("/", (req, res) => res.send("Scrapper API server"));

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
}

export { app };
