import fetch from "node-fetch";
import { writeFile } from "fs";
import { formatProduct } from "./format.js";
import { checkLastModified } from "./utils.js";

const cursors = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
const releaseDate = new Date().toISOString().split("T")[0];
let products = [];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function process(cursor) {
  try {
    const response = await fetch(
      `https://www.pricecharting.com/console/apple-iphone?sort=name&release-date=${releaseDate}&cursor=${cursor}&format=json`
    );
    const json = await response.json();

    return json.products;
  } catch (error) {
    throw error;
  }
}

if (await checkLastModified("./products.json")) {
  console.log("Downloading & Processing...");
  for await (const cursor of cursors) {
    await delay(1000);

    const result = await process();
    const items = [];

    for (const item of result) {
      items.push(formatProduct(item));
    }

    console.log(`- Added ${items.length} items`);

    products = [...products, ...items];

    console.log(`- Total Items: ${products.length}`);
    console.log("\n");
  }

  writeFile("./products.json", JSON.stringify({ products }), (error) => {
    if (error) {
      console.log("An error has occurred ", error);
    }
    console.log("Data written successfully to disk");
    console.log({ products: products.length });
  });
} else {
  console.log("Use cached json file");
}
