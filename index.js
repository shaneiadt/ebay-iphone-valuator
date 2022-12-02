fetch('https://shaneiadt.github.io/ebay-iphone-valuator/products/products.json')
    .then((response) => response.json())
    .then((data) => console.log(data));