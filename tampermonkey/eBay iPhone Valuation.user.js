// ==UserScript==
// @name         eBay iPhone Valuation
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add additional iPhone data to eBay listings.
// @author       shaneiadt@gmail.com
// @match        https://www.ebay.ie/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pricecharting.com
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    function processData(items) {
        // TODO: could sort by shortest title first so items have a better chance to match the item tags
        const entries = [...document.querySelectorAll("li.s-item[data-viewport]")];

        for (const entry of entries) {
            const title = entry.querySelector(".s-item__title span").innerText;

            const mostMatches = { num: 0, ref: null };

            for (const item of items) {
                const n = item.tags.reduce((num, tag) => {
                    if (title.toLowerCase().includes(tag)) {
                        num++;
                    }

                    return num;
                }, 0);

                if (n > mostMatches.num) {
                    mostMatches.num = n;
                    mostMatches.ref = item;
                }
            }

            if(mostMatches.ref){
                const p = document.createElement("p");
                const a = document.createElement("a");
                a.href = mostMatches.ref.href;
                a.innerText = mostMatches.ref.title;
                p.appendChild(a);
                const p2 = document.createElement("p");
                p2.innerText = `Used: ${mostMatches.ref.usedPrice}, Refurb: ${mostMatches.ref.refurbPrice}, New: ${mostMatches.ref.newPrice}`;
                entry.querySelector(".s-item__info").appendChild(p);
                entry.querySelector(".s-item__info").appendChild(p2);
            }
        }
    }

    window.onload = () => {
        fetch(
            "https://raw.githubusercontent.com/shaneiadt/ebay-iphone-valuator/main/products.json"
        )
            .then((res) => res.json())
            .then(({items}) => processData(items))
            .catch((e) => console.error(e));
    };
})();
