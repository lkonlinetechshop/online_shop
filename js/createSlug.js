document.querySelectorAll(".card").forEach(function(card) {

    const name = card.dataset.name;

    const link = card.querySelector("a");

    if (link && name) {

        link.href =
            "product-details.html?product=" +
            createSlug(name);

    }

});