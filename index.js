import requestPromise from "request-promise";
import * as cheerio from "cheerio";
import { writeFile } from "fs";
import getExchangeRate from "./currency.js";

async function scrape() {
  console.log("Fetching exchange rate...");

  const rate = await getExchangeRate();

  console.log("Downloading...");

  const releaseDate = new Date().toISOString().split("T")[0];
  const items = [];
  const paginationMax = 500;

  for (let index = 0; index <= paginationMax; index += 50) {
    const url = `https://www.pricecharting.com/console/apple-iphone?sort=popularity&release-date=${releaseDate}&cursor=${index}`;
    const html = await requestPromise.get(url);
    const $ = cheerio.load(html);

    $("tr[id^='product']").each((_, product) => {
      const id = $(product).attr("id");
      const title = $(`#${id} .title`).text().trim();
      const url = $(`#${id} .title a`).attr("href");
      const usedPrice =
        "€" +
        ($(`#${id} .used_price`).text().replace("$", "").trim() * rate).toFixed(
          2
        );
      const refurbPrice =
        "€" +
        ($(`#${id} .cib_price`).text().replace("$", "").trim() * rate).toFixed(
          2
        );
      const newPrice =
        "€" +
        ($(`#${id} .new_price`).text().replace("$", "").trim() * rate).toFixed(
          2
        );
      const tags = [
        title.split("[")[0].toLowerCase().trimEnd(),
        ...title.replace("]", "").split("[")[1].toLowerCase().split(" "),
      ];

      items.push({
        title,
        url: `https://www.pricecharting.com/console/apple-iphone${url}`,
        tags,
        usedPrice,
        newPrice,
        refurbPrice,
      });
    });
  }

  items.sort((a, b) => b.title.length - a.title.length);

  writeFile("./products.json", JSON.stringify({ items }), (error) => {
    if (error) {
      console.log("An error has occurred ", error);
      return;
    }
    console.log("Data written successfully to disk");
  });
}

scrape();
