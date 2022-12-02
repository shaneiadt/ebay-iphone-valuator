// https://www.pricecharting.com/console/apple-iphone

const downloadObjectAsJson = (exportObj, exportName) => {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(exportObj));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

const getElements = () => {
  const rows = [...document.querySelectorAll("tbody tr")];

  const items = [];

  for (const row of rows) {
    const title = row.querySelector(".title").innerText;
    const usedPrice = row.querySelector(".used_price").innerText;
    const refurbPrice = row.querySelector(".cib_price").innerText;
    const newPrice = row.querySelector(".new_price").innerText;
    const href = row.querySelector("a").href;

    items.push({
      title,
      href,
      usedPrice,
      refurbPrice,
      newPrice,
      tags: [
        title.split("[")[0].toLowerCase().trimEnd(),
        ...title.split("[")[1].toLowerCase().split(" "),
      ],
    });
  }

  return items;
};

(() => {
  const load = () => {
    let stop = false;

    let el = document.querySelector('input[value~="more"]');

    if (el) {
      el.scrollIntoView();
      setTimeout(() => load(), 1000);
    } else {
      stop = true;

      downloadObjectAsJson({ items: getElements() }, `products`);
    }
  };
  load();
})();
