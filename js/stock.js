const STOCK_API_URL =
    "https://script.google.com/macros/s/AKfycbxYkRyLnMCvU9aecBTwUy62smFCrg6uvuFXnHvFZxYAG4svSwZl-dI-Ox-4sbzM3XLb/exec";


async function loadProductStock() {

    try {

        const response = await fetch(STOCK_API_URL);

        if (!response.ok) {
            throw new Error("Failed to load stock data");
        }

        const products = await response.json();

        products.forEach(product => {

            const card = document.querySelector(
                `.card[data-id="${product.id}"]`
            );

            if (!card) {
                return;
            }

            const stockElement = card.querySelector(".stock");
            const cartButton = card.querySelector(".add-cart");

            const stock = Number(product.stock) || 0;

            if (stock > 0) {

                stockElement.textContent = "In Stock";

                stockElement.classList.remove("out-of-stock");
                stockElement.classList.add("in-stock");

                if (cartButton) {
                    cartButton.disabled = false;
                    cartButton.textContent = "Add to Cart";
                }

            } else {

                stockElement.textContent = "Out of Stock";

                stockElement.classList.remove("in-stock");
                stockElement.classList.add("out-of-stock");

                if (cartButton) {
                    cartButton.disabled = true;
                    cartButton.textContent = "Out of Stock";
                }

            }

        });

    } catch (error) {

        console.error("Stock loading error:", error);

    }
}


document.addEventListener("DOMContentLoaded", () => {
    loadProductStock();
});