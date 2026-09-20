const form = document.getElementById("signup-form");

form.addEventListener("submit", function (e) {
e.preventDefault();

const name = document.getElementById("name").value.trim();
const email = document.getElementById("email").value.trim().toLowerCase();
const password = document.getElementById("password").value;
const confirmPassword = document.getElementById("confirmPassword").value;

// Validate fields
if (!name || !email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
}

// Check passwords
if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
}

// Password length
if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
}

// Create user
const user = {
    name: name,
    email: email,
    password: password
};

// Save user
localStorage.setItem("user", JSON.stringify(user));

// Automatically sign in
localStorage.setItem("loggedIn", "true");

alert("Account created successfully!");

// Go directly to home page
window.location.href = "index.html";


});
