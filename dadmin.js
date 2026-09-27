const DB_NAME = "cnc3dDesignDB";
const STORE_NAME = "designs";

const loginBox = document.getElementById("login-box");
const adminPanel = document.getElementById("admin-panel");
const passwordInput = document.getElementById("admin-password");
const loginBtn = document.getElementById("login-btn");
const loginMessage = document.getElementById("login-message");

const uploadForm = document.getElementById("upload-form");
const uploadMessage = document.getElementById("upload-message");
const adminList = document.getElementById("admin-list");
const clearBtn = document.getElementById("clear-btn");

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

async function saveDesign(design) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        transaction.objectStore(STORE_NAME).put(design);

        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
    });
}

async function getDesigns() {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const request = db
            .transaction(STORE_NAME, "readonly")
            .objectStore(STORE_NAME)
            .getAll();

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

async function deleteDesign(id) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        transaction.objectStore(STORE_NAME).delete(id);

        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
    });
}

async function deleteAllDesigns() {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        transaction.objectStore(STORE_NAME).clear();

        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
    });
}

loginBtn.addEventListener("click", () => {
    // DEMO ONLY. Do not use this password system for a real public website.
    if (passwordInput.value === "0124") {
        loginBox.classList.add("hidden");
        adminPanel.classList.remove("hidden");
        loadAdminList();
    } else {
        loginMessage.textContent = "Incorrect password.";
    }
});

uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const imageFile = document.getElementById("image-file").files[0];
    const designFile = document.getElementById("design-file").files[0];

    if (!imageFile || !designFile) {
        uploadMessage.textContent = "Please select both files.";
        return;
    }

    const design = {
        id: crypto.randomUUID(),
        title,
        description,
        category,
        fileType: getFileExtension(designFile.name).toUpperCase(),
        fileName: designFile.name,
        image: imageFile,
        fileBlob: designFile,
        createdAt: new Date().toISOString()
    };

    try {
        await saveDesign(design);

        uploadMessage.textContent = "Design uploaded successfully.";
        uploadForm.reset();
        loadAdminList();
    } catch (error) {
        console.error(error);
        uploadMessage.textContent =
            "Upload failed. The browser may not have enough storage.";
    }
});

function getFileExtension(filename) {
    const parts = filename.split(".");
    return parts.length > 1 ? parts.pop() : "FILE";
}

async function loadAdminList() {
    const designs = await getDesigns();

    adminList.innerHTML = "";

    if (!designs.length) {
        adminList.innerHTML =
            "<p style='color:#64748b'>No uploaded designs yet.</p>";
        return;
    }

    designs.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    designs.forEach(design => {
        const row = document.createElement("div");
        row.className = "admin-item";

        const img = document.createElement("img");

        if (design.image instanceof Blob) {
            img.src = URL.createObjectURL(design.image);
        } else {
            img.src = design.image;
        }

        const details = document.createElement("div");

        const title = document.createElement("h3");
        title.textContent = design.title;

        const text = document.createElement("p");
        text.textContent =
            `${design.fileType} • ${design.fileName} • ${design.category}`;

        details.append(title, text);

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-one";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", async () => {
            if (confirm(`Delete "${design.title}"?`)) {
                await deleteDesign(design.id);
                loadAdminList();
            }
        });

        row.append(img, details, deleteButton);
        adminList.appendChild(row);
    });
}

clearBtn.addEventListener("click", async () => {
    const designs = await getDesigns();

    if (!designs.length) return;

    if (confirm("Delete all uploaded designs?")) {
        await deleteAllDesigns();
        loadAdminList();
    }
});
