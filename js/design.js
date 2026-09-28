const DB_NAME = "cnc3dDesignDB";
const STORE_NAME = "designs";

const sampleDesigns = [
    {
        id: "sample-1",
        title: "CNC Gear Wheel",
        description: "Precision gear model suitable for CNC machining projects.",
        category: "Mechanical",
        fileType: "STL",
        fileName: "cnc-gear-wheel.stl",
        image: makePlaceholder("CNC Gear"),
        sample: true
    },
    {
        id: "sample-2",
        title: "CNC Name Plate",
        description: "Decorative name plate design for CNC engraving.",
        category: "Engraving",
        fileType: "DXF",
        fileName: "name-plate.dxf",
        image: makePlaceholder("Name Plate"),
        sample: true
    },
    {
        id: "1",
        title: "Gift Hart design",
        description: "2D gift design.",
        category: "2D design",
        fileType: "Art",
        fileName: "2ddesign/gift_hart.art",
        image: "2ddesign/gift_hart.jpg",
        sample: true
    }
];

function makePlaceholder(text) {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="500">
            <rect width="100%" height="100%" fill="#dbeafe"/>
            <text x="50%" y="50%" dominant-baseline="middle"
                  text-anchor="middle" font-family="Arial"
                  font-size="52" font-weight="bold" fill="#0369a1">
                ${text}
            </text>
        </svg>`;
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getUploadedDesigns() {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

async function getAllDesigns() {
    const uploaded = await getUploadedDesigns();
    return [...uploaded, ...sampleDesigns];
}

function createCard(design) {
    const card = document.createElement("article");
    card.className = "design-card";

    const image = document.createElement("img");

image.className = "design-image";

if (typeof design.image === "string") {

    image.src = design.image;

}
else if (design.image instanceof Blob) {

    image.src =
        URL.createObjectURL(design.image);

}
else {

    image.src =
        makePlaceholder("CNC Design");

}

image.alt = design.title;

    const info = document.createElement("div");
    info.className = "design-info";

    const title = document.createElement("h3");
    title.textContent = design.title;

    const description = document.createElement("p");
    description.className = "description";
    description.textContent = design.description || "CNC 3D design file.";

    const meta = document.createElement("div");
    meta.className = "meta";

    const type = document.createElement("span");
    type.className = "badge";
    type.textContent = design.fileType || "FILE";

    const category = document.createElement("span");
    category.className = "badge";
    category.textContent = design.category || "CNC";

    meta.append(type, category);

    const button = document.createElement("button");
    button.className = "download-btn";
    button.textContent = "⬇ Download Design";

    button.addEventListener("click", () => downloadDesign(design));

    info.append(title, description, meta, button);
    card.append(image, info);

    return card;
}

function downloadDesign(design) {
    if (!design.fileBlob) {
        alert(
            "This is a sample design card. Upload a real STL, DXF, STEP, OBJ or other file from the Admin page to enable downloading."
        );
        return;
    }

    const url = URL.createObjectURL(design.fileBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = design.fileName || "cnc-design";
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function displayDesigns() {
    const grid = document.getElementById("design-grid");
    const empty = document.getElementById("empty-message");
    const search = document.getElementById("search");

    const designs = await getAllDesigns();

    function render() {
        const query = search.value.trim().toLowerCase();
        grid.innerHTML = "";

        const filtered = designs.filter(d =>
            (d.title || "").toLowerCase().includes(query) ||
            (d.category || "").toLowerCase().includes(query) ||
            (d.fileType || "").toLowerCase().includes(query)
        );

        empty.style.display = filtered.length ? "none" : "block";

        filtered.forEach(design => {
            grid.appendChild(createCard(design));
        });
    }

    search.addEventListener("input", render);
    render();
}

document.addEventListener("DOMContentLoaded", displayDesigns);
