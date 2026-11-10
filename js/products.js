
// =====================================
// LOAD PRODUCTS FROM GOOGLE SHEETS
// =====================================

const productContainer =
  document.getElementById("product-list");

function safeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

async function displayProducts() {
  try {
    const products = await getLankaCNCProducts();

    if (!products.length) {
      productContainer.innerHTML =
        "<p>No products available.</p>";
      return;
    }

    productContainer.innerHTML = products.map(product => {
      const slug = createSlug(product.name);

      const image = safeHTML(product.image);
      const name = safeHTML(product.name);
      const category = safeHTML(product.category);

      return `
        <div class="card"
             data-id="${product.id}"
             data-name="${name}"
             data-price="${product.price}"
             data-image="${image}"
             data-category="${category}">

          const discountValue = Number(product.discount);

const discountPercent = discountValue <= 1
    ? Math.round(discountValue * 100)
    : Math.round(discountValue);

const discountBadge = discountPercent > 0
    ? `<span class="discount">-${discountPercent}% Off</span>`
    : "";

          <a href="product-details.html?product=${encodeURIComponent(slug)}">
            <img src="${image}"
                 alt="${name}"
                 loading="lazy">
          </a>

          <h3>${name}</h3>

          <p class="category">${category}</p>

          <div class="price">
            <strong>Rs. ${Number(product.price).toLocaleString()}</strong>
            ${
              product.oldPrice > product.price
                ? `<del>Rs. ${Number(product.oldPrice).toLocaleString()}</del>`
                : ""
            }
          </div>

          <p class="stock">
            ${product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <button class="add-cart"
                  data-id="${product.id}"
                  data-name="${name}"
                  data-price="${product.price}"
                  data-image="${image}"
                  ${product.stock <= 0 ? "disabled" : ""}>
            Add To Cart
          </button>

        </div>
      `;
    }).join("");

  } catch (error) {
    console.error(error);

    productContainer.innerHTML =
      "<p>Products could not be loaded. Please try again.</p>";
  }
}

displayProducts();
