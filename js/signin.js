const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwHyVCsqR0YAGI0ZFx37fcPF2IOM5I5KoEWXJRK62QaCg45HR2Wxg6T49o-IctuqUi-/exec";


const form =
    document.getElementById("signin-form");


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
 * Sign in
 */
form.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


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


        // Validate
        if (!email || !password) {

            alert(
                "Please enter your email and password."
            );

            return;
        }


        try {

            // Hash password
            const passwordHash =
                await hashPassword(password);


            /*
             * Use GET for sign in.
             *
             * encodeURIComponent prevents
             * special characters from breaking
             * the URL.
             */
            const url =
                GOOGLE_SCRIPT_URL +
                "?action=signin" +
                "&email=" +
                encodeURIComponent(email) +
                "&passwordHash=" +
                encodeURIComponent(passwordHash);


            const response =
                await fetch(url);


            const result =
                await response.json();


            if (!result.success) {

            alert("Invalid Email or Password");

            // Clear email and password
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";

            // Put cursor back in email field
            document.getElementById("email").focus();

            return;
        }


            // Save login status
            localStorage.setItem(
                "loggedIn",
                "true"
            );


            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify({
                    name:
                        result.user.name,

                    email:
                        result.user.email,

                    signupDate:
                        result.user.signupDate
                })
            );


            alert(
                "Login Successful!"
            );


            // Go to home page
            window.location.href =
                "index.html";


        } catch (error) {

            console.error(error);

            alert(
                "Could not connect to the server. Please try again."
            );
             document.getElementById("email").value = "";
             document.getElementById("password").value = "";

             document.getElementById("email").focus();
        }

    }
);
