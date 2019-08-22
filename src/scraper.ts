import axios from "axios";
import cherio from "cherio";
import db from "./db";
import { OPENCOLLECTIVE_URL } from "./constants";

export const getHTML = async (url: string) => {
  const { data: html } = await axios.get(url);
  return html;
};

export const scrapeMoneyDonated = async () => {
  try {
    const base = await db;
    const result = base
      .get("opencollective")
      .find({ date: getDateKey() })
      .value();
    if (result) {
      return result.count;
    } else {
      return scrapeAmount();
    }
  } catch (e) {
    console.log(e);
  }
};

const scrapeAmount = async () => {
  const html = await getHTML(OPENCOLLECTIVE_URL);
  const $ = cherio.load(html);
  const totalAmountDiv = $(".totalAmountSpent");
  const span = await totalAmountDiv.children().first();
  const count = span.get(0).children[0].data;
  const base = await db;
  base
    .get("opencollective")
    .push({ date: getDateKey(), count })
    .write();
  return count;
};

const getDateKey = () => {
  const date = new Date();
  return `${date.getDay()}-${date.getFullYear()}`;
};
