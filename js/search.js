function searchProducts() {

    const searchInput = document.getElementById("search");
    const value = searchInput.value.toLowerCase();

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        const title = card.querySelector("h3").textContent.toLowerCase();

        if (title.includes(value)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

    // Move to product list after clicking Search
    document.getElementById("product-list").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Search when button is clicked
document.getElementById("search-btn").addEventListener("click", searchProducts);
