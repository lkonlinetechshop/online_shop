// ==========================================
// LANKACNC PRODUCT STOCK SYSTEM
// ==========================================

// Google Apps Script Stock API
const STOCK_API_URL =
    "https://script.google.com/macros/s/AKfycbxYkRyLnMCvU9aecBTwUy62smFCrg6uvuFXnHvFZxYAG4svSwZl-dI-Ox-4sbzM3XLb/exec";


// ==========================================
// LOAD STOCK DATA
// ==========================================

async function loadProductStock() {

    try {

        const response = await fetch(
            STOCK_API_URL,
            {
                method: "GET",
                cache: "no-store"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load stock data"
            );

        }


        const products =
            await response.json();


        console.log(
            "Stock API data:",
            products
        );


        // ======================================
        // PRODUCT DETAILS PAGE
        // ======================================

        updateProductDetailsStock(
            products
        );


        // ======================================
        // PRODUCT LIST / HOME PAGE
        // ======================================

        updateProductCards(
            products
        );


    }
    catch (error) {

        console.error(
            "Stock loading error:",
            error
        );

    }

}


// ==========================================
// UPDATE PRODUCT DETAILS PAGE
// ==========================================

function updateProductDetailsStock(
    stockProducts
) {

    // --------------------------------------
    // GET PRODUCT DETAILS CONTAINER
    // --------------------------------------

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


    // --------------------------------------
    // GET BUTTONS / ELEMENTS
    // --------------------------------------

    const addCartBtn =
        document.getElementById(
            "addCartBtn"
        );


    const stockElement =
        productDetails.querySelector(
            ".stock"
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


    // --------------------------------------
    // ADD TO CART BUTTON CHECK
    // --------------------------------------

    if (!addCartBtn) {

        console.warn(
            "Add To Cart button not found."
        );

        return;

    }


    // ======================================
    // GET PRODUCT ID
    // ======================================

    const productId =
        productDetails.getAttribute(
            "data-product-id"
        );


    if (!productId) {

        console.error(
            "Product ID not found on product details page."
        );

        return;

    }


    console.log(
        "Product details ID:",
        productId
    );


    // ======================================
    // FIND STOCK RECORD
    // ======================================

    const stockProduct =
        stockProducts.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (!stockProduct) {

        console.error(
            "Stock record not found for product ID:",
            productId
        );

        return;

    }


    // ======================================
    // GET STOCK NUMBER
    // ======================================

    const stock =
        Number(
            stockProduct.stock
        ) || 0;


    console.log(
        "Product ID:",
        productId,
        "Current Stock:",
        stock
    );


    // ======================================
    // IN STOCK
    // ======================================

    if (stock > 0) {


        // ----------------------------------
        // STOCK TEXT
        // ----------------------------------

       if (stockElement) {

        stockElement.textContent =
            "In Stock";
//  `In Stock (${stock})`;   // show stock with number
    

        stockElement.classList.remove(
            "out-of-stock"
        );

        stockElement.classList.add(
            "in-stock"
        );
    }


        // ----------------------------------
        // QUANTITY
        // ----------------------------------

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


        // ----------------------------------
        // ADD TO CART
        // ----------------------------------

        addCartBtn.disabled =
            false;


        addCartBtn.innerHTML =
            '<i class="fa-solid fa-cart-shopping"></i> Add To Cart';


        // ----------------------------------
        // PLUS BUTTON
        // ----------------------------------

        if (plusBtn) {

            plusBtn.disabled =
                false;

        }


        // ----------------------------------
        // MINUS BUTTON
        // ----------------------------------

        if (minusBtn) {

            minusBtn.disabled =
                false;

        }

    }


    // ======================================
    // OUT OF STOCK
    // ======================================

    else {


        // ----------------------------------
        // STOCK TEXT
        // ----------------------------------

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


        // ----------------------------------
        // ADD TO CART
        // ----------------------------------

        addCartBtn.disabled =
            true;


        addCartBtn.innerHTML =
            '<i class="fa-solid fa-ban"></i> Out of Stock';


        // ----------------------------------
        // QUANTITY
        // ----------------------------------

        if (quantityInput) {

            quantityInput.value =
                0;

            quantityInput.disabled =
                true;

        }


        // ----------------------------------
        // PLUS BUTTON
        // ----------------------------------

        if (plusBtn) {

            plusBtn.disabled =
                true;

        }


        // ----------------------------------
        // MINUS BUTTON
        // ----------------------------------

        if (minusBtn) {

            minusBtn.disabled =
                true;

        }

    }


    // ======================================
    // PROTECT QUANTITY
    // ======================================

    if (
        stock > 0 &&
        quantityInput
    ) {

        // Prevent duplicate event listeners
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

}


// ==========================================
// UPDATE PRODUCT CARDS
// ==========================================

function updateProductCards(
    products
) {

    if (!Array.isArray(products)) {

        console.error(
            "Stock API did not return an array."
        );

        return;

    }


    products.forEach(
        product => {

            const card =
                document.querySelector(
                    `.card[data-id="${product.id}"]`
                );


            if (!card) {

                return;

            }


            const stockElement =
                card.querySelector(
                    ".stock"
                );


            const cartButton =
                card.querySelector(
                    ".add-cart"
                );


            const stock =
                Number(
                    product.stock
                ) || 0;


            // ==============================
            // IN STOCK
            // ==============================

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


            // ==============================
            // OUT OF STOCK
            // ==============================

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
// START STOCK SYSTEM
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "Stock system started..."
        );

        loadProductStock();

    }
);
