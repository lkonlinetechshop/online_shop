const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwHyVCsqR0YAGI0ZFx37fcPF2IOM5I5KoEWXJRK62QaCg45HR2Wxg6T49o-IctuqUi-/exec";


const form =
    document.getElementById(
        "reset-password-form"
    );


/*
====================================================
GET EMAIL AND TOKEN FROM URL
====================================================
*/

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const email =
    urlParams.get("email");


const token =
    urlParams.get("token");


/*
====================================================
CHECK RESET LINK
====================================================
*/

if (!email || !token) {

    alert(
        "This password reset link is invalid."
    );

    window.location.href =
        "signin.html";
}


/*
====================================================
HASH PASSWORD
====================================================
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
            new Uint8Array(
                hashBuffer
            )
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


/*
====================================================
RESET PASSWORD
====================================================
*/

form.addEventListener(
    "submit",
    async function(e) {

        e.preventDefault();


        const password =
            document
                .getElementById("password")
                .value;


        const confirmPassword =
            document
                .getElementById(
                    "confirmPassword"
                )
                .value;


        /*
        Check password length
        */
        if (
            password.length < 6
        ) {

            alert(
                "Password must be at least 6 characters long."
            );

            return;
        }


        /*
        Check passwords
        */
        if (
            password !==
            confirmPassword
        ) {

            alert(
                "Passwords do not match."
            );

            return;
        }


        try {

            /*
            Hash new password
            */
            const passwordHash =
                await hashPassword(
                    password
                );


            /*
            Build reset request
            */
            const url =
                GOOGLE_SCRIPT_URL +
                "?action=resetPassword" +
                "&email=" +
                encodeURIComponent(email) +
                "&token=" +
                encodeURIComponent(token) +
                "&passwordHash=" +
                encodeURIComponent(
                    passwordHash
                );


            const response =
                await fetch(url);


            const result =
                await response.json();


            if (!result.success) {

                alert(
                    result.message
                );

                return;
            }


            alert(
                "Password changed successfully. You can now sign in."
            );


            /*
            Go to sign in
            */
            window.location.href =
                "signin.html";


        } catch (error) {

            console.error(error);


            alert(
                "Could not connect to the server. Please try again."
            );
        }

    }
);
