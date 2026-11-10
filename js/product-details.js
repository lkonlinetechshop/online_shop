
// =====================================
// PRODUCT DETAILS FROM GOOGLE SHEETS
// =====================================

let currentProduct = null;
let selectedOption = null;

const params = new URLSearchParams(window.location.search);
const productSlug = params.get("product");

const nameEl = document.getElementById("product-name");
const imageEl = document.getElementById("product-image");
const categoryEl = document.getElementById("product-category");
const priceEl = document.getElementById("product-price");
const stockEl = document.getElementById("product-stock");
const descriptionEl = document.getElementById("product-description");
const optionsEl = document.getElementById("product-options");
const quantityEl = document.getElementById("quantity");
const addButton = document.getElementById("add-to-cart");

function escapeProductText(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// =====================================
// LOAD PRODUCT
// =====================================
async function loadProductDetails() {
  try {
    if (!productSlug) {
      throw new Error("Product link is missing.");
    }

    const products = await getLankaCNCProducts();

    currentProduct = products.find(product =>
      createSlug(product.name) === productSlug
    );

    if (!currentProduct) {
      throw new Error("Product not found.");
    }

    renderProductDetails();

  } catch (error) {
    document.querySelector("main").innerHTML =
      `<p>${escapeProductText(error.message)}</p>`;
  }
}

// =====================================
// RENDER PRODUCT
// =====================================
function renderProductDetails() {
  const product = currentProduct;

  document.title = product.name + " | LankaCNC";

  nameEl.textContent = product.name;
  categoryEl.textContent = product.category;
  descriptionEl.textContent = product.description;

  imageEl.src = product.image;
  imageEl.alt = product.name;

  const pdf1 = document.getElementById("manual-pdf-1");
  const pdf2 = document.getElementById("manual-pdf-2");

  if (product.manualPdf1) {
    pdf1.href = product.manualPdf1;
    pdf1.hidden = false;
  }

  if (product.manualPdf2) {
    pdf2.href = product.manualPdf2;
    pdf2.hidden = false;
  }

  optionsEl.innerHTML = "";

  if (product.options && product.options.length) {
    product.options.forEach((option, index) => {
      const optionElement = document.createElement("option");

      optionElement.value = index;
      optionElement.textContent =
        `${option.size} - Rs. ${Number(option.price).toLocaleString()}`;

      optionsEl.appendChild(optionElement);
    });

    optionsEl.hidden = false;
    selectedOption = product.options[0];

    optionsEl.addEventListener("change", updateSelectedOption);

  } else {
    optionsEl.hidden = true;
    selectedOption = null;
  }

  updateProductPrice();
}

// =====================================
// CHANGE SIZE OPTION
// =====================================
function updateSelectedOption() {
  const index = Number(optionsEl.value);

  selectedOption = currentProduct.options[index];

  updateProductPrice();
}

// =====================================
// UPDATE PRICE AND STOCK
// =====================================
function updateProductPrice() {
  const price = selectedOption
    ? Number(selectedOption.price)
    : Number(currentProduct.price);

  const stock = selectedOption
    ? Number(selectedOption.stock)
    : Number(currentProduct.stock);

  priceEl.textContent =
    "Rs. " + price.toLocaleString();

  stockEl.textContent =
    stock > 0 ? `In Stock (${stock})` : "Out of Stock";

  addButton.disabled = stock <= 0;
}

// =====================================
// ADD TO CART
// =====================================
addButton.addEventListener("click", () => {
  if (!currentProduct) return;

  const quantity = Number(quantityEl.value);

  const stock = selectedOption
    ? Number(selectedOption.stock)
    : Number(currentProduct.stock);

  if (!Number.isInteger(quantity) || quantity < 1) {
    alert("Please enter a valid quantity.");
    return;
  }

  if (quantity > stock) {
    alert("Requested quantity is not available.");
    return;
  }

  const price = selectedOption
    ? Number(selectedOption.price)
    : Number(currentProduct.price);

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartItem = {
    id: currentProduct.id,
    name: currentProduct.name,
    price: price,
    image: currentProduct.image,
    size: selectedOption ? selectedOption.size : "",
    quantity: quantity
  };

  const existing = cart.find(item =>
    Number(item.id) === Number(cartItem.id) &&
    (item.size || "") === cartItem.size
  );

  if (existing) {
    if (existing.quantity + quantity > stock) {
      alert("Not enough stock for this quantity.");
      return;
    }

    existing.quantity += quantity;
  } else {
    cart.push(cartItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Product added to cart!");

  window.location.href = "cart.html";
});

// =====================================
// START
// =====================================
loadProductDetails();
