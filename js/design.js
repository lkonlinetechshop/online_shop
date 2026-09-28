```javascript
// ========================================
// MANUAL CNC DESIGNS
// ========================================

const designs = [

    {
        id: "1",
        title: "Gift Heart Design",
        description: "2D heart gift design for CNC engraving.",
        category: "2D Design",
        fileType: "ART",
        fileName: "gift_hart.art",
        image: "2ddesign/gift_hart.jpg",
        file: "2ddesign/gift_hart.art"
    },

    {
        id: "2",
        title: "CNC Gear Wheel",
        description: "Precision gear wheel design for CNC machining.",
        category: "Mechanical",
        fileType: "STL",
        fileName: "cnc-gear-wheel.stl",
        image: "images/cnc-gear.jpg",
        file: "designs/cnc-gear-wheel.stl"
    },

    {
        id: "3",
        title: "CNC Name Plate",
        description: "Decorative name plate for CNC engraving.",
        category: "Engraving",
        fileType: "DXF",
        fileName: "name-plate.dxf",
        image: "images/name-plate.jpg",
        file: "designs/name-plate.dxf"
    }

];


// ========================================
// CREATE DESIGN CARD
// ========================================

function createCard(design) {

    const card = document.createElement("article");
    card.className = "design-card";


    // IMAGE
    const image = document.createElement("img");

    image.className = "design-image";

    image.src = design.image;

    image.alt = design.title;

    image.onerror = function () {
        this.src = "images/default-design.jpg";
    };


    // INFO
    const info = document.createElement("div");

    info.className = "design-info";


    // TITLE
    const title = document.createElement("h3");

    title.textContent = design.title;


    // DESCRIPTION
    const description = document.createElement("p");

    description.className = "description";

    description.textContent =
        design.description || "CNC design file.";


    // META
    const meta = document.createElement("div");

    meta.className = "meta";


    // FILE TYPE
    const type = document.createElement("span");

    type.className = "badge";

    type.textContent = design.fileType;


    // CATEGORY
    const category = document.createElement("span");

    category.className = "badge";

    category.textContent = design.category;


    meta.append(type, category);


    // DOWNLOAD BUTTON
    const button = document.createElement("button");

    button.className = "download-btn";

    button.textContent = "⬇ Download Design";


    button.addEventListener("click", function () {

        downloadDesign(design);

    });


    // ADD EVERYTHING
    info.append(
        title,
        description,
        meta,
        button
    );

    card.append(
        image,
        info
    );


    return card;
}


// ========================================
// DOWNLOAD DESIGN
// ========================================

function downloadDesign(design) {

    if (!design.file) {

        alert("Design file not available.");

        return;

    }


    const link = document.createElement("a");

    link.href = design.file;

    link.download = design.fileName;

    document.body.appendChild(link);

    link.click();

    link.remove();

}


// ========================================
// DISPLAY DESIGNS
// ========================================

function displayDesigns() {

    const grid =
        document.getElementById("design-grid");

    const empty =
        document.getElementById("empty-message");

    const search =
        document.getElementById("search");


    function render() {

        const query =
            search.value.trim().toLowerCase();


        grid.innerHTML = "";


        const filtered =
            designs.filter(function (design) {

                return (

                    design.title
                        .toLowerCase()
                        .includes(query)

                    ||

                    design.category
                        .toLowerCase()
                        .includes(query)

                    ||

                    design.fileType
                        .toLowerCase()
                        .includes(query)

                );

            });


        empty.style.display =
            filtered.length ? "none" : "block";


        filtered.forEach(function (design) {

            grid.appendChild(
                createCard(design)
            );

        });

    }


    search.addEventListener(
        "input",
        render
    );


    render();

}


// ========================================
// START
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    displayDesigns
);
```
