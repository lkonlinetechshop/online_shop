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

    if (value !== "") {
        document.getElementById("product-list").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

document.getElementById("search-btn").addEventListener("click", searchProducts);
