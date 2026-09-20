const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-btn");
const productList = document.getElementById("product-list");


// Filter products
function filterProducts() {

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
}


// While typing → filter only
searchInput.addEventListener("input", filterProducts);


// Click Search → filter + scroll
searchButton.addEventListener("click", function() {

    filterProducts();

    productList.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});


// Press Enter → filter + scroll
searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        filterProducts();

        productList.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

});
