const searchInput = document.getElementById("search");

searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    document.querySelectorAll(".card").forEach(card => {

        const title =
        card.querySelector("h3").textContent.toLowerCase();

        if(title.includes(value)){
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});