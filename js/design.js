// ==========================================
// LANKACNC DESIGN LIBRARY - script.js
// ==========================================


// ==========================================
// MOBILE MENU
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", function () {

        mainNav.classList.toggle("active");

        // Change menu icon
        if (mainNav.classList.contains("active")) {
            menuToggle.innerHTML = "✕";
        } else {
            menuToggle.innerHTML = "☰";
        }

    });

}


// ==========================================
// SEARCH DESIGNS
// ==========================================

const searchInput = document.getElementById("searchInput");
const designGrid = document.getElementById("designGrid");
const noResults = document.getElementById("noResults");

if (searchInput && designGrid) {

    const designCards = designGrid.querySelectorAll(".design-card");

    searchInput.addEventListener("input", function () {

        const searchText = searchInput.value
            .toLowerCase()
            .trim();

        let foundDesigns = 0;

        designCards.forEach(function (card) {

            const title =
                card.dataset.title || "";

            const description =
                card.dataset.description || "";

            const tags =
                card.dataset.tags || "";

            const fileType =
                card.dataset.fileType || "";

            const searchableText = (
                title + " " +
                description + " " +
                tags + " " +
                fileType
            ).toLowerCase();

            if (searchableText.includes(searchText)) {

                card.style.display = "";

                foundDesigns++;

            } else {

                card.style.display = "none";

            }

        });


        // Show / hide "No designs found"
        if (noResults) {

            if (foundDesigns === 0) {
                noResults.style.display = "block";
            } else {
                noResults.style.display = "none";
            }

        }

    });

}


// ==========================================
// FILE TYPE BADGES
// ==========================================

const fileBadges =
    document.querySelectorAll("[data-file-badge]");

fileBadges.forEach(function (badge) {

    const fileType =
        badge.textContent.trim().toUpperCase();

    badge.textContent = fileType;

    // Add class based on file type
    badge.classList.add(
        "file-" + fileType.toLowerCase()
    );

});


// ==========================================
// DOWNLOAD BUTTON - SIGN IN REQUIRED
// ==========================================

const downloadButtons =
    document.querySelectorAll(".download-btn");

downloadButtons.forEach(function (button) {

    button.addEventListener("click", function (e) {

        // Check existing login session
        const sessionToken =
            localStorage.getItem("sessionToken");

        const user =
            localStorage.getItem("user");

        // ==========================================
        // NOT SIGNED IN
        // ==========================================

        if (!sessionToken || !user) {

            e.preventDefault();

            // Remember the current design page
            localStorage.setItem(
                "downloadReturnUrl",
                window.location.href
            );

            alert("Please sign in to download designs.");

            // Go to sign-in page
            window.location.href = "signin.html";

            return;
        }

        // ==========================================
        // SIGNED IN
        // ==========================================

        console.log(
            "Downloading design:",
            button.getAttribute("href")
        );

        // Do NOT prevent the default action.
        // The download will continue normally.
    });

});

// ==========================================
// CLOSE MOBILE MENU WHEN LINK IS CLICKED
// ==========================================

const navLinks =
    document.querySelectorAll(".main-nav a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        if (mainNav) {
            mainNav.classList.remove("active");
        }

        if (menuToggle) {
            menuToggle.innerHTML = "☰";
        }

    });

});


// ==========================================
// IMAGE ERROR HANDLING
// ==========================================

const designImages =
    document.querySelectorAll(".design-image img");

designImages.forEach(function (image) {

    image.addEventListener("error", function () {

        console.log(
            "Image could not be loaded:",
            image.src
        );

        image.style.display = "none";

    });

});
