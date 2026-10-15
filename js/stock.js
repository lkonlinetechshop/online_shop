
// ==========================================
// LANKACNC HOME PAGE STOCK + PRICE SYSTEM
// ==========================================
// Google Apps Script API
// Controls:
// 1. Stock
// 2. Price
// 3. Old Price
// 4. Discount
// 5. Add To Cart button
// ==========================================

const STOCK_API_URL =
    "https://script.google.com/macros/s/AKfycbxYkRyLnMCvU9aecBTwUy62smFCrg6uvuFXnHvFZxYAG4svSwZl-dI-Ox-4sbzM3XLb/exec";


// ==========================================
// FORMAT PRICE
// ==========================================

function formatPrice(price) {

    const number = Number(price) || 0;

    return "Rs." + number.toLocaleString("en-LK");
}


// ==========================================
// UPDATE ONE PRODUCT CARD
// ==========================================

function updateProductCard(product) {

    if (!product || product.id === undefined) {
        return;
    }

    const card = document.querySelector(
        `.card[data-id="${String(product.id)}"]`
    );

    if (!card) {
        return;
    }


    // ======================================
    // GET CARD ELEMENTS
    // ======================================

    const stockElement = card.querySelector(".stock");
    const cartButton = card.querySelector(".add-cart");

    const priceElement = card.querySelector(".price strong");
    const oldPriceElement = card.querySelector(".price del");
    const discountElement = card.querySelector(".discount");


    // ======================================
    // GET GOOGLE SHEET VALUES
    // ======================================

    const stock = Number(product.stock) || 0;

    const price = Number(product.price) || 0;

    const oldPrice = Number(product.oldPrice) || 0;

    const discount = Number(product.discount) || 0;


    // ======================================
    // UPDATE PRICE
    // ======================================

    if (priceElement && price > 0) {

        priceElement.textContent = formatPrice(price);

    }


    // ======================================
    // UPDATE OLD PRICE
    // ======================================

    if (oldPriceElement && oldPrice > 0) {

        oldPriceElement.textContent = formatPrice(oldPrice);

    }


    // ======================================
    // UPDATE DISCOUNT
    // ======================================

    if (discountElement) {

        if (discount > 0) {

            discountElement.textContent = `-${discount}%`;

            discountElement.style.display = "";

        } else {

            discountElement.textContent = "";

            discountElement.style.display = "none";

        }

    }


    // ======================================
    // UPDATE DATA-PRICE
    // ======================================

    if (cartButton && price > 0) {

        cartButton.dataset.price = String(price);

    }


    // ======================================
    // UPDATE STOCK
    // ======================================

    if (stockElement) {

        if (stock > 0) {

            // -------------------------------
            // IN STOCK
            // -------------------------------

            stockElement.textContent = "In Stock";

            stockElement.classList.remove("out-of-stock");

            stockElement.classList.add("in-stock");

        } else {

            // -------------------------------
            // OUT OF STOCK
            // -------------------------------

            stockElement.textContent = "Out of Stock";

            stockElement.classList.remove("in-stock");

            stockElement.classList.add("out-of-stock");

        }

    }


    // ======================================
    // UPDATE ADD TO CART BUTTON
    // ======================================

    if (cartButton) {

        if (stock > 0) {

            // -------------------------------
            // AVAILABLE
            // -------------------------------

            cartButton.disabled = false;

            cartButton.textContent = "Add to Cart";

            cartButton.classList.remove("out-of-stock");

        } else {

            // -------------------------------
            // OUT OF STOCK
            // -------------------------------

            cartButton.disabled = true;

            cartButton.textContent = "Out of Stock";

            cartButton.classList.add("out-of-stock");

        }

    }

}


// ==========================================
// LOAD STOCK + PRICE DATA
// ==========================================

async function loadProductStock() {

    try {

        console.log("Loading product data from Google Sheet...");


        // ==================================
        // FETCH GOOGLE SHEET API
        // ==================================

        const response = await fetch(STOCK_API_URL, {
            method: "GET",
            cache: "no-store"
        });


        if (!response.ok) {

            throw new Error(
                `Failed to load product data. HTTP ${response.status}`
            );

        }


        // ==================================
        // CONVERT RESPONSE TO JSON
        // ==================================

        const products = await response.json();


        // ==================================
        // VALIDATE RESPONSE
        // ==================================

        if (!Array.isArray(products)) {

            throw new Error(
                "Invalid product data received from Google Sheet."
            );

        }


        console.log(
            "Google Sheet product data:",
            products
        );


        // ==================================
        // UPDATE ALL PRODUCT CARDS
        // ==================================

        products.forEach(product => {

            updateProductCard(product);

        });


        console.log(
            `Updated ${products.length} products.`
        );


    } catch (error) {

        console.error(
            "Product stock/price loading error:",
            error
        );

    }

}


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProductStock();

    }
);
