const form = document.getElementById("signin-form");

if (form) {
    form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    // Show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <span class="login-spinner"></span>
        Signing In...
    `;

    try {
        const result = await authRequest("signin", {
            email: email,
            password: password
        });

        if (!result.success) {
            alert(result.message || "Sign in failed.");
            return;
        }

        // Save session
        saveSession(result.sessionToken);

        if (result.user) {
            localStorage.setItem(
                "user",
                JSON.stringify(result.user)
            );
        }

        // Login successful
        window.location.href = "index.html";

    } catch (error) {

        console.error("Sign in error:", error);

        alert("Unable to connect to the server. Please try again.");

    } finally {

        // If page is not redirected, restore button
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Sign In";
    }
});
}
