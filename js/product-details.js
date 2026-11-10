
function createSlug(name) {

    return String(name)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

}

function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);

}

function money(value) {
    return Number(value || 0).toLocaleString("en-LK");
}

let currentProduct = null;

async function loadProductDetails() {

    const container =
        document.getElementById("product-details");

    const slug =
        new URLSearchParams(window.location.search)
            .get("product");

    try {

        const products = await getLankaCNCProducts();

        const product = products.find(p =>
            createSlug(p.name) === slug
        );

        if (!product) {

            container.innerHTML = "<h2>Product Not Found</h2>";
            return;

        }

        currentProduct = product;
        window.currentProduct = product;

        const options = Array.isArray(product.options)
            ? product.options
            : [];

        const initialPrice = options.length
            ? Number(options[0].price)
            : Number(product.price);

        // SEO title
        document.title = product.name + " | LankaCNC.LK";

        const canonicalURL =
            window.location.origin +
            window.location.pathname +
            "?product=" + encodeURIComponent(createSlug(product.name));

        document.querySelector("#canonical-url").href =
            canonicalURL;

        document.querySelector('meta[name="description"]').content =
            product.name + " - Buy from LankaCNC.LK. " +
            product.description;

        document.querySelector('meta[property="og:title"]').content =
            product.name + " | LankaCNC.LK";

        document.querySelector('meta[property="og:description"]').content =
            product.description;

        document.querySelector('meta[property="og:image"]').content =
            new URL(product.image, window.location.href).href;

        document.querySelector('meta[property="og:url"]').content =
            canonicalURL;

        container.dataset.productId = product.id;

        // Product HTML
        container.innerHTML = `

            <div class="product-details"
                 data-product-id="${product.id}">

                <div>
                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                    >
                </div>

                <div class="product-info">

                    <span class="discount">
                        ${product.discount
                            ? "-" + escapeHTML(product.discount)
                            : ""}
                    </span>

                    <h1>${escapeHTML(product.name)}</h1>

                    <p class="category">
                        ${escapeHTML(product.category)}
                    </p>

                    <div class="rating">
                        ${escapeHTML(product.rating)}
                    </div>

                    <p class="price">

                        ${product.oldPrice ? `
                            <del>Rs.${money(product.oldPrice)}</del>
                        ` : ""}

                        <strong id="currentPrice">
                            Rs.${money(initialPrice)}
                        </strong>

                    </p>

                    <span class="stock" id="productStock">
                        ${options.length
                            ? (Number(options[0].stock) > 0
                                ? "In Stock"
                                : "Out of Stock")
                            : (Number(product.stock) > 0
                                ? "In Stock"
                                : "Out of Stock")}
                    </span>

                    <div class="product-description">
                        ${escapeHTML(product.description).replace(/\n/g, "<br>")}
                    </div>

                    ${product.manualPdf1 ? `
                        <div class="product-manual">
                            <a href="${escapeHTML(product.manualPdf1)}"
                               target="_blank"
                               rel="noopener noreferrer"
                               class="manual-btn">
                                <i class="fa-solid fa-file-pdf"></i>
                                View / Download Manual
                            </a>
                        </div>
                    ` : ""}

                    ${product.manualPdf2 ? `
                        <div class="product-manual">
                            <a href="${escapeHTML(product.manualPdf2)}"
                               target="_blank"
                               rel="noopener noreferrer"
                               class="manual-btn">
                                <i class="fa-solid fa-file-pdf"></i>
                                View / Download Manual 2
                            </a>
                        </div>
                    ` : ""}

                    <div class="product-options">

                        ${options.length ? `
                            <div class="bit-size-section">

                                <label>Size</label>

                                <div id="bitSizes">

                                    ${options.map((option, index) => `

                                        <label class="size-option">

                                            <input
                                                type="radio"
                                                name="bitSize"
                                                value="${escapeHTML(option.size)}"
                                                data-price="${Number(option.price)}"
                                                data-stock="${Number(option.stock)}"
                                                ${index === 0 ? "checked" : ""}
                                            >

                                            <span>
                                                ${escapeHTML(option.size)}
                                            </span>

                                        </label>

                                    `).join("")}

                                </div>

                            </div>
                        ` : ""}

                        <div class="quantity-section">

                            <label>Quantity</label>

                            <div class="quantity-box">

                                <button type="button" id="minusBtn">-</button>

                                <input
                                    type="text"
                                    id="quantity"
                                    value="1"
                                    readonly
                                >

                                <button type="button" id="plusBtn">+</button>

                            </div>

                        </div>

                        <div class="selected-price">
                            Rs.
                            <span id="selectedPrice">
                                ${money(initialPrice)}
                            </span>
                        </div>

                    </div>

                    <button
                        type="button"
                        class="add-cart buy-btn"
                        id="addCartBtn">

                        <i class="fa-solid fa-cart-shopping"></i>
                        Add To Cart

                    </button>

                </div>

            </div>

        `;

        updateProductSchema(product);

        setupProductEvents(product);

    } catch (error) {

        console.error(error);

        container.innerHTML =
            "<h2>Unable to load product. Please try again.</h2>";

    }

}


// ==========================================
// PRODUCT SCHEMA
// ==========================================

function updateProductSchema(product) {

    const price = product.options?.length
        ? product.options[0].price
        : product.price;

    const schema = {

        "@context": "https://schema.org",

        "@type": "Product",

        "name": product.name,

        "image": [
            new URL(product.image, window.location.href).href
        ],

        "description": product.description,

        "category": product.category,

        "brand": {
            "@type": "Brand",
            "name": "LankaCNC"
        },

        "offers": {

            "@type": "Offer",

            "url": window.location.href,

            "priceCurrency": "LKR",

            "price": String(price),

            "availability": Number(product.stock) > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock"

        }

    };

    document.getElementById("product-schema").textContent =
        JSON.stringify(schema);

}


// ==========================================
// PRODUCT EVENTS
// ==========================================

function setupProductEvents(product) {

    const quantityInput =
        document.getElementById("quantity");

    document.getElementById("plusBtn").onclick = function() {

        quantityInput.value =
            Number(quantityInput.value) + 1;

    };

    document.getElementById("minusBtn").onclick = function() {

        if (Number(quantityInput.value) > 1) {
            quantityInput.value =
                Number(quantityInput.value) - 1;
        }

    };

    document.querySelectorAll('input[name="bitSize"]')
        .forEach(input => {

            input.addEventListener("change", function() {

                document.getElementById("selectedPrice")
                    .textContent = money(this.dataset.price);

                document.getElementById("currentPrice")
                    .textContent = "Rs." + money(this.dataset.price);

                document.getElementById("productStock")
                    .textContent = Number(this.dataset.stock) > 0
                        ? "In Stock"
                        : "Out of Stock";

            });

        });

    document.getElementById("addCartBtn").onclick =
        () => addToCart(product);

}


// ==========================================
// ADD TO CART
// ==========================================

function addToCart(product) {

    const quantity = Number(
        document.getElementById("quantity").value
    ) || 1;

    const selectedOption =
        document.querySelector('input[name="bitSize"]:checked');

    const selectedSize = selectedOption
        ? selectedOption.value
        : "";

    const selectedPrice = selectedOption
        ? Number(selectedOption.dataset.price)
        : Number(product.price);

    const availableStock = selectedOption
        ? Number(selectedOption.dataset.stock)
        : Number(product.stock);

    if (availableStock <= 0) {

        alert("This product is Out of Stock.");
        return;

    }

    if (quantity > availableStock) {

        alert("Only " + availableStock + " items available.");
        return;

    }

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const existingProduct = cart.find(item =>
        Number(item.id) === Number(product.id) &&
        item.size === selectedSize
    );

    const existingQuantity =
        existingProduct ? Number(existingProduct.quantity) : 0;

    if (existingQuantity + quantity > availableStock) {

        alert("Available stock is " + availableStock + ".");
        return;

    }

    if (existingProduct) {

        existingProduct.quantity += quantity;

    } else {

        cart.push({

            id: Number(product.id),

            name: product.name,

            price: selectedPrice,

            image: product.image,

            size: selectedSize,

            quantity: quantity

        });

    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert(product.name + " added to cart!");

    window.location.href = "cart.html";

}


// ==========================================
// START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    loadProductDetails
);
