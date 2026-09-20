function searchProducts() {

    const searchInput = document.getElementById("search");
    const value = searchInput.value.trim().toLowerCase();

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {

        const title = card.querySelector("h3").textContent.toLowerCase();

        if (title.includes(value)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

    // Move to product list after search
    document.getElementById("product-list").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// Click Search button
document.getElementById("search-btn").addEventListener("click", searchProducts);


// Press Enter inside search box
document.getElementById("search").addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        searchProducts();
    }

});
