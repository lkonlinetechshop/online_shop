const form = document.getElementById("signup-form");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const button = form.querySelector("button[type='submit']");

        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        button.disabled = true;

        try {
            const result = await authRequest("signup", {
                name,
                email,
                password
            });

            if (!result.success) {
                alert(result.message || "Could not create the account.");
                return;
            }

            alert("Account created successfully. Please sign in.");
            window.location.href = "signin.html";
        } catch (error) {
            console.error(error);
            alert("Could not connect to the authentication server. Please try again.");
        } finally {
            button.disabled = false;
        }
    });
}
