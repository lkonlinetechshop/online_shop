const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwHyVCsqR0YAGI0ZFx37fcPF2IOM5I5KoEWXJRK62QaCg45HR2Wxg6T49o-IctuqUi-/exec";


const form = document.getElementById("signup-form");


/**
 * Convert password to SHA-256 hash
 */
async function hashPassword(password) {

    const encoder =
        new TextEncoder();

    const data =
        encoder.encode(password);

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    const hashArray =
        Array.from(
            new Uint8Array(hashBuffer)
        );

    return hashArray
        .map(
            byte =>
                byte
                    .toString(16)
                    .padStart(2, "0")
        )
        .join("");
}


/**
 * Signup
 */
form.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim()
                .toLowerCase();


        const password =
            document
                .getElementById("password")
                .value;


        const confirmPassword =
            document
                .getElementById("confirmPassword")
                .value;


        // Validate fields
        if (
            !name ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            alert(
                "Please fill in all fields."
            );

            return;
        }


        // Check passwords
        if (
            password !== confirmPassword
        ) {

            alert(
                "Passwords do not match!"
            );

            return;
        }


        // Password length
        if (
            password.length < 6
        ) {

            alert(
                "Password must be at least 6 characters long."
            );

            return;
        }


        try {

            // Hash password
            const passwordHash =
                await hashPassword(password);


            // Send to Google Apps Script
            const response =
                await fetch(
                    GOOGLE_SCRIPT_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body: JSON.stringify({

                            action: "signup",

                            name: name,

                            email: email,

                            passwordHash:
                                passwordHash
                        })
                    }
                );


            const result =
                await response.json();


            if (!result.success) {

                alert(
                    result.message
                );

                return;
            }


            alert(
                "Account created successfully!"
            );


            // Store only login status locally
            localStorage.setItem(
                "loggedIn",
                "true"
            );


            // Store basic user information
            localStorage.setItem(
                "user",
                JSON.stringify({
                    name: name,
                    email: email
                })
            );


            // Go to home page
            window.location.href =
                "index.html";


        } catch (error) {

            console.error(error);

            alert(
                "Could not connect to the server. Please try again."
            );
        }

    }
);
