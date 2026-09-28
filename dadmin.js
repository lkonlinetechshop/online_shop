
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


/* =========================================
   OPEN INDEXEDDB
========================================= */

function openDB() {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = () => {

            const db = request.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {

                db.createObjectStore(STORE_NAME, {
                    keyPath: "id"
                });

            }

        };

        request.onsuccess = () => {

            resolve(request.result);

        };

        request.onerror = () => {

            reject(request.error);

        };

    });

}


/* =========================================
   SAVE DESIGN
========================================= */

async function saveDesign(design) {

    const db = await openDB();

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(STORE_NAME, "readwrite");

        transaction
            .objectStore(STORE_NAME)
            .put(design);

        transaction.oncomplete = () => {

            resolve();

        };

        transaction.onerror = () => {

            reject(transaction.error);

        };

    });

}


/* =========================================
   GET DESIGNS
========================================= */

async function getDesigns() {

    const db = await openDB();

    return new Promise((resolve, reject) => {

        const request =
            db
                .transaction(STORE_NAME, "readonly")
                .objectStore(STORE_NAME)
                .getAll();

        request.onsuccess = () => {

            resolve(request.result || []);

        };

        request.onerror = () => {

            reject(request.error);

        };

    });

}


/* =========================================
   DELETE ONE DESIGN
========================================= */

async function deleteDesign(id) {

    const db = await openDB();

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(STORE_NAME, "readwrite");

        transaction
            .objectStore(STORE_NAME)
            .delete(id);

        transaction.oncomplete = () => {

            resolve();

        };

        transaction.onerror = () => {

            reject(transaction.error);

        };

    });

}


/* =========================================
   DELETE ALL DESIGNS
========================================= */

async function deleteAllDesigns() {

    const db = await openDB();

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(STORE_NAME, "readwrite");

        transaction
            .objectStore(STORE_NAME)
            .clear();

        transaction.oncomplete = () => {

            resolve();

        };

        transaction.onerror = () => {

            reject(transaction.error);

        };

    });

}


/* =========================================
   IMAGE FILE → DATA URL
========================================= */

function fileToDataURL(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {

            resolve(reader.result);

        };

        reader.onerror = () => {

            reject(reader.error);

        };

        reader.readAsDataURL(file);

    });

}


/* =========================================
   ADMIN LOGIN
========================================= */

loginBtn.addEventListener("click", () => {

    // DEMO ONLY
    if (passwordInput.value === "0124") {

        loginBox.classList.add("hidden");

        adminPanel.classList.remove("hidden");

        loadAdminList();

    } else {

        loginMessage.textContent =
            "Incorrect password.";

    }

});


/* =========================================
   UPLOAD DESIGN
========================================= */

uploadForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const title =
        document.getElementById("title")
            .value
            .trim();

    const description =
        document.getElementById("description")
            .value
            .trim();

    const category =
        document.getElementById("category")
            .value;

    const imageFile =
        document.getElementById("image-file")
            .files[0];

    const designFile =
        document.getElementById("design-file")
            .files[0];


    /* CHECK FILES */

    if (!imageFile || !designFile) {

        uploadMessage.textContent =
            "Please select both files.";

        return;

    }


    /* CHECK IMAGE */

    if (!imageFile.type.startsWith("image/")) {

        uploadMessage.textContent =
            "Please select a valid image.";

        return;

    }


    try {

        uploadMessage.textContent =
            "Uploading...";


        /* ---------------------------------
           CONVERT IMAGE TO DATA URL
        --------------------------------- */

        const imageData =
            await fileToDataURL(imageFile);


        /* ---------------------------------
           CREATE DESIGN OBJECT
        --------------------------------- */

        const design = {

            id: crypto.randomUUID(),

            title: title,

            description: description,

            category: category,

            fileType:
                getFileExtension(
                    designFile.name
                ).toUpperCase(),

            fileName:
                designFile.name,

            /*
             * IMPORTANT
             *
             * Save image as Data URL.
             * This allows index.html
             * to display the image.
             */

            image: imageData,

            /*
             * Keep original CNC file
             * as Blob for downloading.
             */

            fileBlob: designFile,

            createdAt:
                new Date().toISOString()

        };


        /* ---------------------------------
           SAVE TO DATABASE
        --------------------------------- */

        await saveDesign(design);


        uploadMessage.textContent =
            "Design uploaded successfully!";


        /* RESET FORM */

        uploadForm.reset();


        /* REFRESH ADMIN LIST */

        await loadAdminList();


    } catch (error) {

        console.error(error);

        uploadMessage.textContent =
            "Upload failed. The browser may not have enough storage.";

    }

});


/* =========================================
   GET FILE EXTENSION
========================================= */

function getFileExtension(filename) {

    const parts =
        filename.split(".");

    return parts.length > 1
        ? parts.pop()
        : "FILE";

}


/* =========================================
   LOAD ADMIN DESIGN LIST
========================================= */

async function loadAdminList() {

    const designs =
        await getDesigns();

    adminList.innerHTML = "";


    if (!designs.length) {

        adminList.innerHTML =
            "<p style='color:#64748b'>No uploaded designs yet.</p>";

        return;

    }


    /* NEWEST FIRST */

    designs.sort((a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );


    designs.forEach(design => {

        const row =
            document.createElement("div");

        row.className =
            "admin-item";


        /* ---------------------------------
           IMAGE
        --------------------------------- */

        const img =
            document.createElement("img");


        /*
         * New uploads use Data URL.
         *
         * Old uploads may still use Blob.
         *
         * Support both.
         */

        if (typeof design.image === "string") {

            img.src =
                design.image;

        } else if (design.image instanceof Blob) {

            img.src =
                URL.createObjectURL(
                    design.image
                );

        } else {

            img.src =
                "";

        }


        img.alt =
            design.title || "CNC Design";


        /* ---------------------------------
           DETAILS
        --------------------------------- */

        const details =
            document.createElement("div");


        const title =
            document.createElement("h3");

        title.textContent =
            design.title;


        const text =
            document.createElement("p");

        text.textContent =
            `${design.fileType} • ${design.fileName} • ${design.category}`;


        details.append(
            title,
            text
        );


        /* ---------------------------------
           DELETE BUTTON
        --------------------------------- */

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "delete-one";

        deleteButton.textContent =
            "Delete";


        deleteButton.addEventListener(
            "click",
            async () => {

                if (
                    confirm(
                        `Delete "${design.title}"?`
                    )
                ) {

                    await deleteDesign(
                        design.id
                    );

                    await loadAdminList();

                }

            }
        );


        /* ---------------------------------
           ADD TO ROW
        --------------------------------- */

        row.append(
            img,
            details,
            deleteButton
        );


        adminList.appendChild(row);

    });

}


/* =========================================
   DELETE ALL
========================================= */

clearBtn.addEventListener(
    "click",
    async () => {

        const designs =
            await getDesigns();


        if (!designs.length) {

            return;

        }


        if (
            confirm(
                "Delete all uploaded designs?"
            )
        ) {

            await deleteAllDesigns();

            await loadAdminList();

        }

    }
);
