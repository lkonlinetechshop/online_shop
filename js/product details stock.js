```js
// ==========================================
// STOCK API
// ==========================================

const STOCK_API_URL =
    "https://script.google.com/macros/s/AKfycbxYkRyLnMCvU9aecBTwUy62smFCrg6uvuFXnHvFZxYAG4svSwZl-dI-Ox-4sbzM3XLb/exec";


// ==========================================
// LOAD STOCK
// ==========================================

async function loadProductStock() {

    try {

        const response =
            await fetch(STOCK_API_URL, {
                cache: "no-store"
            });


        if (!response.ok) {

            throw new Error(
                "Failed to load stock data"
            );

        }


        const products =
            await response.json();


        console.log(
            "Stock data:",
            products
        );


        // ======================================
        // PRODUCT DETAILS PAGE
        // ======================================

        const productDetails =
            document.getElementById(
                "product-details"
            );


        if (productDetails) {

            updateProductDetailsStock(
                products
            );

        }


        // ======================================
        // PRODUCT LIST PAGE
        // ======================================

        updateProductCards(products);


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

    const addCartBtn =
        document.getElementById(
            "addCartBtn"
        );


    const stockElement =
        document.querySelector(
            "#product-details .stock"
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


    if (!addCartBtn) {

        return;

    }


    // ======================================
    // GET PRODUCT ID
    // ======================================

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const productSlug =
        urlParams.get("product");


    if (!productSlug) {

        return;

    }


    // ======================================
    // CREATE SAME SLUG AS PRODUCT DETAILS
    // ======================================

    function createSlug(name) {

        return name
            .toLowerCase()
            .trim()
            .replace(
                /[^a-z0-9\s-]/g,
                ""
            )
            .replace(
                /\s+/g,
                "-"
            )
            .replace(
                /-+/g,
                "-"
            );

    }


    // ======================================
    // FIND PRODUCT ID FROM PAGE
    // ======================================

    /*
       product-details.js creates the product
       from its slug.

       We can read the product name from
       the <h1> element.
    */

    const productTitle =
        document.querySelector(
            "#product-details h1"
        );


    if (!productTitle) {

        return;

    }


    const productName =
        productTitle.textContent.trim();


    const productIdMatch =
        stockProducts.find(
            stockProduct => {

                /*
                   The stock API should return
                   the same product id.

                   We match the stock record
                   with the product name/slug
                   through the page URL below.
                */

                return true;

            }
        );


    // ======================================
    // BETTER MATCH:
    // USE PRODUCT ID STORED IN DATA ATTRIBUTE
    // ======================================

    /*
       product-details.js will add:

       data-product-id="19"

       to #product-details.
    */

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


    const stockProduct =
        stockProducts.find(
            item =>
                String(item.id) ===
                String(productId)
        );


    if (!stockProduct) {

        console.error(
            "Stock record not found for product:",
            productId
        );

        return;

    }


    const stock =
        Number(
            stockProduct.stock
        ) || 0;


    console.log(
        "Product ID:",
        productId,
        "Stock:",
        stock
    );


    // ======================================
    // IN STOCK
    // ======================================

    if (stock > 0) {

        if (stockElement) {

            stockElement.textContent =
                "In Stock (" +
                stock +
                ")";

            stockElement.classList.remove(
                "out-of-stock"
            );

            stockElement.classList.add(
                "in-stock"
            );

        }


        // Maximum quantity

        if (quantityInput) {

            quantityInput.max =
                stock;

            quantityInput.value =
                Math.min(
                    Number(quantityInput.value) || 1,
                    stock
                );

        }


        // Enable buttons

        addCartBtn.disabled =
            false;

        addCartBtn.innerHTML =
            '<i class="fa-solid fa-cart-shopping"></i> Add To Cart';


        if (plusBtn) {

            plusBtn.disabled =
                false;

        }


        if (minusBtn) {

            minusBtn.disabled =
                false;

        }

    }


    // ======================================
    // OUT OF STOCK
    // ======================================

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


        // Disable Add To Cart

        addCartBtn.disabled =
            true;

        addCartBtn.innerHTML =
            '<i class="fa-solid fa-ban"></i> Out of Stock';


        // Disable quantity controls

        if (quantityInput) {

            quantityInput.value =
                0;

            quantityInput.disabled =
                true;

        }


        if (plusBtn) {

            plusBtn.disabled =
                true;

        }


        if (minusBtn) {

            minusBtn.disabled =
                true;

        }

    }


    // ======================================
    // PROTECT QUANTITY
    // ======================================

    if (stock > 0 && quantityInput) {

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

    }

}


// ==========================================
// UPDATE PRODUCT CARDS
// ==========================================

function updateProductCards(
    products
) {

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
// START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProductStock();

    }
);
```