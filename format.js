export const formatProduct = (product) => {
  const {
    id,
    productUri: uri,
    price1: usedPrice,
    price2: refurbPrice,
    price3: newPrice,
    productName: name,
  } = product;

  const tags = uri.split('-');

  return { id, name, uri, newPrice, usedPrice, refurbPrice, tags };
};
