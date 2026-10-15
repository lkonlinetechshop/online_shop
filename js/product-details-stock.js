
// ==========================================
// LANKACNC PRODUCT STOCK + PRICE SYSTEM
// ==========================================


// ==========================================
// GOOGLE APPS SCRIPT API
// ==========================================

const STOCK_API_URL =
    "https://script.google.com/macros/s/AKfycbxYkRyLnMCvU9aecBTwUy62smFCrg6uvuFXnHvFZxYAG4svSwZl-dI-Ox-4sbzM3XLb/exec";


// ==========================================
// LOAD STOCK / PRICE DATA
// ==========================================

async function loadProductStock() {

    try {

        const response =
            await fetch(
                STOCK_API_URL,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        // ======================================
        // CHECK RESPONSE
        // ======================================

        if (!response.ok) {

            throw new Error(
                "Failed to load product data"
            );

        }


        // ======================================
        // GET JSON
        // ======================================

        const stockProducts =
            await response.json();


        // ======================================
        // CHECK ARRAY
        // ======================================

        if (!Array.isArray(stockProducts)) {

            throw new Error(
                "Stock API did not return an array."
            );

        }


        console.log(
            "LankaCNC API data:",
            stockProducts
        );


        // ======================================
        // PRODUCT DETAILS PAGE
        // ======================================

        updateProductDetails(
            stockProducts
        );


        // ======================================
        // PRODUCT CARDS / HOME PAGE
        // ======================================

        updateProductCards(
            stockProducts
        );


    }

    catch (error) {

        console.error(
            "Product stock/price loading error:",
            error
        );

    }

}


// ==========================================
// UPDATE PRODUCT DETAILS PAGE
// ==========================================

function updateProductDetails(
    stockProducts
) {


    // ==========================================
    // GET PRODUCT DETAILS CONTAINER
    // ==========================================

    const productDetails =
        document.getElementById(
            "product-details"
        );


    if (!productDetails) {

        console.warn(
            "Product details container not found."
        );

        return;

    }


    // ==========================================
    // GET CURRENT PRODUCT
    // ==========================================

    const product =
        window.currentProduct;


    if (!product) {

        console.warn(
            "Current product not found."
        );

        return;

    }


    // ==========================================
    // GET PRODUCT ID
    // ==========================================

    const productId =
        productDetails.getAttribute(
            "data-product-id"
        );


    if (!productId) {

        console.error(
            "Product ID not found."
        );

        return;

    }


    console.log(
        "Product Details ID:",
        productId
    );


    // ==========================================
    // FIND GOOGLE SHEET RECORD
    // ==========================================

    const liveProduct =
        stockProducts.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (!liveProduct) {

        console.warn(
            "No Google Sheet record found for Product ID:",
            productId
        );

        return;

    }


    // ==========================================
    // GET LIVE VALUES
    // ==========================================

    const stock =
        Number(
            liveProduct.stock
        ) || 0;


    const price =
        Number(
            liveProduct.price
        ) || 0;


    const oldPrice =
        Number(
            liveProduct.oldPrice
        ) || 0;


    const discount =
        Number(
            String(
                liveProduct.discount || 0
            ).replace(
                "%",
                ""
            )
        ) || 0;


    console.log(
        "Live Product:",
        {
            id: productId,
            stock: stock,
            price: price,
            oldPrice: oldPrice,
            discount: discount
        }
    );


    // ==========================================
    // UPDATE JS PRODUCT OBJECT
    // ==========================================

    product.stock =
        stock;


    product.price =
        price;


    product.oldPrice =
        oldPrice;


    product.discount =
        discount + "%";


    // ==========================================
    // GET HTML ELEMENTS
    // ==========================================

    const stockElement =
        productDetails.querySelector(
            ".stock"
        );


    const discountElement =
        productDetails.querySelector(
            ".discount"
        );


    const priceElement =
        document.getElementById(
            "currentPrice"
        );


    const selectedPriceElement =
        document.getElementById(
            "selectedPrice"
        );


    const oldPriceElement =
        productDetails.querySelector(
            ".price del"
        );


    const addCartBtn =
        document.getElementById(
            "addCartBtn"
        );


    const quantityInput =
        document.getElementById(
            "quantity"
        );


    const plusBtn =
        document.getElementById(
            "plusBtn"
        );


    const minusBtn =
        document.getElementById(
            "minusBtn"
        );


    // ==========================================
    // UPDATE DISCOUNT
    // ==========================================

    if (discountElement) {

        discountElement.textContent =
            "-" + discount + "%";

    }


    // ==========================================
    // UPDATE OLD PRICE
    // ==========================================

    if (oldPriceElement) {

        oldPriceElement.textContent =
            "Rs." +
            oldPrice.toLocaleString();

    }


    // ==========================================
    // UPDATE PRICE
    // ==========================================

    /*
        IMPORTANT:

        If the product has size/bit options,
        each option already has its own price
        in product-details.js.

        Therefore Google Sheet price is used
        directly for products WITHOUT options.

        Products with options keep their
        option-specific prices.
    */

    if (
        !product.options ||
        product.options.length === 0
    ) {

        if (priceElement) {

            priceElement.textContent =
                "Rs." +
                price.toLocaleString();

        }


        if (selectedPriceElement) {

            selectedPriceElement.textContent =
                price.toLocaleString();

        }

    }


    // ==========================================
    // UPDATE STOCK
    // ==========================================

    if (stock > 0) {

        // ======================================
        // IN STOCK
        // ======================================

        if (stockElement) {

            stockElement.textContent =
                "In Stock";


            stockElement.classList.remove(
                "out-of-stock"
            );


            stockElement.classList.add(
                "in-stock"
            );

        }


        // ======================================
        // ADD TO CART ENABLE
        // ======================================

        if (addCartBtn) {

            addCartBtn.disabled =
                false;


            addCartBtn.innerHTML =
                '<i class="fa-solid fa-cart-shopping"></i> Add To Cart';

        }


        // ======================================
        // QUANTITY ENABLE
        // ======================================

        if (quantityInput) {

            quantityInput.disabled =
                false;


            quantityInput.max =
                stock;


            let quantity =
                Number(
                    quantityInput.value
                ) || 1;


            if (quantity < 1) {

                quantity = 1;

            }


            if (quantity > stock) {

                quantity = stock;

            }


            quantityInput.value =
                quantity;

        }


        // ======================================
        // PLUS ENABLE
        // ======================================

        if (plusBtn) {

            plusBtn.disabled =
                false;

        }


        // ======================================
        // MINUS ENABLE
        // ======================================

        if (minusBtn) {

            minusBtn.disabled =
                false;

        }

    }


    else {

        // ======================================
        // OUT OF STOCK
        // ======================================

        if (stockElement) {

            stockElement.textContent =
                "Out of Stock";


            stockElement.classList.remove(
                "in-stock"
            );


            stockElement.classList.add(
                "out-of-stock"
            );

        }


        // ======================================
        // DISABLE ADD TO CART
        // ======================================

        if (addCartBtn) {

            addCartBtn.disabled =
                true;


            addCartBtn.innerHTML =
                '<i class="fa-solid fa-ban"></i> Out of Stock';

        }


        // ======================================
        // DISABLE QUANTITY
        // ======================================

        if (quantityInput) {

            quantityInput.value =
                0;


            quantityInput.disabled =
                true;

        }


        // ======================================
        // DISABLE PLUS
        // ======================================

        if (plusBtn) {

            plusBtn.disabled =
                true;

        }


        // ======================================
        // DISABLE MINUS
        // ======================================

        if (minusBtn) {

            minusBtn.disabled =
                true;

        }

    }


    // ==========================================
    // PROTECT QUANTITY FROM EXCEEDING STOCK
    // ==========================================

    if (
        stock > 0 &&
        quantityInput
    ) {


        if (
            quantityInput.dataset.stockListener !==
            "true"
        ) {


            quantityInput.addEventListener(
                "change",
                function() {


                    let quantity =
                        Number(
                            this.value
                        ) || 1;


                    if (quantity < 1) {

                        quantity = 1;

                    }


                    if (quantity > stock) {

                        quantity = stock;

                    }


                    this.value =
                        quantity;

                }
            );


            quantityInput.dataset.stockListener =
                "true";

        }

    }


    // ==========================================
    // UPDATE PRODUCT SCHEMA
    // ==========================================

    if (
        typeof window.updateProductSchema ===
        "function"
    ) {

        window.updateProductSchema();

    }

}


// ==========================================
// UPDATE HOME / PRODUCT CARDS
// ==========================================

function updateProductCards(
    stockProducts
) {


    if (!Array.isArray(stockProducts)) {

        console.error(
            "Invalid product API data."
        );

        return;

    }


    stockProducts.forEach(
        liveProduct => {


            // ==================================
            // FIND CARD
            // ==================================

            const card =
                document.querySelector(
                    `.card[data-id="${liveProduct.id}"]`
                );


            if (!card) {

                return;

            }


            // ==================================
            // GET VALUES
            // ==================================

            const stock =
                Number(
                    liveProduct.stock
                ) || 0;


            const price =
                Number(
                    liveProduct.price
                ) || 0;


            const oldPrice =
                Number(
                    liveProduct.oldPrice
                ) || 0;


            const discount =
                Number(
                    String(
                        liveProduct.discount || 0
                    ).replace(
                        "%",
                        ""
                    )
                ) || 0;


            // ==================================
            // FIND CARD ELEMENTS
            // ==================================

            const stockElement =
                card.querySelector(
                    ".stock"
                );


            const cartButton =
                card.querySelector(
                    ".add-cart"
                );


            const priceElement =
                card.querySelector(
                    ".price strong"
                );


            const oldPriceElement =
                card.querySelector(
                    ".price del"
                );


            const discountElement =
                card.querySelector(
                    ".discount"
                );


            // ==================================
            // UPDATE PRICE
            // ==================================

            if (priceElement) {

                priceElement.textContent =
                    "Rs." +
                    price.toLocaleString();

            }


            // ==================================
            // UPDATE OLD PRICE
            // ==================================

            if (oldPriceElement) {

                oldPriceElement.textContent =
                    "Rs." +
                    oldPrice.toLocaleString();

            }


            // ==================================
            // UPDATE DISCOUNT
            // ==================================

            if (discountElement) {

                discountElement.textContent =
                    "-" +
                    discount +
                    "%";

            }


            // ==================================
            // IN STOCK
            // ==================================

            if (stock > 0) {


                if (stockElement) {

                    stockElement.textContent =
                        "In Stock";


                    stockElement.classList.remove(
                        "out-of-stock"
                    );


                    stockElement.classList.add(
                        "in-stock"
                    );

                }


                if (cartButton) {

                    cartButton.disabled =
                        false;


                    cartButton.textContent =
                        "Add to Cart";

                }

            }


            // ==================================
            // OUT OF STOCK
            // ==================================

            else {


                if (stockElement) {

                    stockElement.textContent =
                        "Out of Stock";


                    stockElement.classList.remove(
                        "in-stock"
                    );


                    stockElement.classList.add(
                        "out-of-stock"
                    );

                }


                if (cartButton) {

                    cartButton.disabled =
                        true;


                    cartButton.textContent =
                        "Out of Stock";

                }

            }

        }
    );

}


// ==========================================
// START PRODUCT STOCK SYSTEM
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "LankaCNC Stock + Price System started..."
        );


        loadProductStock();

    }
);
