const form = document.getElementById("signin-form");

form.addEventListener("submit", function(e){

    e.preventDefault();

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    const savedUser = JSON.parse(
        localStorage.getItem("user")
    );

    if(!savedUser){
        alert("No account found. Please sign up first.");
        return;
    }

    if(
        email === savedUser.email &&
        password === savedUser.password
    ){

        alert("Login Successful!");

        localStorage.setItem(
            "loggedIn",
            "true"
        );

        window.location.href = "index.html";

    }else{

        alert("Invalid Email or Password");

    }

});