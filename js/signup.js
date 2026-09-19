const form = document.getElementById("signup-form");

form.addEventListener("submit", function(e){

    e.preventDefault();

    const name =
    document.getElementById("name").value;

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    const confirmPassword =
    document.getElementById("confirmPassword").value;

    if(password !== confirmPassword){
        alert("Passwords do not match!");
        return;
    }

    const user = {
        name,
        email,
        password
    };

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    alert("Account created successfully!");

    window.location.href = "signin.html";

});