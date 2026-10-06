const GOOGLE_SCRIPT_URL =
    "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";


const form =
    document.getElementById(
        "forgot-password-form"
    );


form.addEventListener(
    "submit",
    async function(e) {

        e.preventDefault();


        const email =
            document
                .getElementById("email")
                .value
                .trim()
                .toLowerCase();


        if (!email) {

            alert(
                "Please enter your email address."
            );

            return;
        }


        try {

            const url =
                GOOGLE_SCRIPT_URL +
                "?action=forgotPassword" +
                "&email=" +
                encodeURIComponent(email);


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
                "If an account exists for this email, a password reset link has been sent. Please check your email."
            );


            document
                .getElementById("email")
                .value = "";


        } catch (error) {

            console.error(error);


            alert(
                "Could not connect to the server. Please try again."
            );
        }

    }
);