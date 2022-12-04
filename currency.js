import fetch from "node-fetch";

const apiKey = "QXFJBMeGxXItq0ubSTxIf1WMCslueoFQ";
const date = new Date().toISOString().split("T")[0];

async function getExchangeRate() {
  const response = await fetch(
    `https://api.apilayer.com/currency_data/change?start_date=${date}&end_date=${date}&currencies=USD,EUR`,
    {
      method: "GET",
      redirect: "follow",
      headers: {
        apiKey,
      },
    }
  );
  const rates = await response.json();

  return rates.quotes["USDEUR"].end_rate;
}

export default getExchangeRate;