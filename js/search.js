
const searchInput = document.getElementById("search");

searchInput.addEventListener("keyup", () => {
    const value = searchInput.value.toLowerCase();
    let firstMatch = null;

    document.querySelectorAll(".card").forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();

        if (title.includes(value)) {
            card.style.display = "block";

            if (!firstMatch) {
                firstMatch = card;
            }
        } else {
            card.style.display = "none";
        }
    });

    if (firstMatch && value !== "") {
        firstMatch.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
});
