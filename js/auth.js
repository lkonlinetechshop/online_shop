const isLoggedIn = localStorage.getItem("loggedIn");

const userStatus =
document.getElementById("user-status");

const logoutBtn =
document.getElementById("logout-btn");

if(isLoggedIn === "true"){

    const user =
    JSON.parse(localStorage.getItem("user"));

    userStatus.textContent =
    `Welcome, ${user.name}`;

    logoutBtn.style.display = "flex";
    

}

const signinLink =
document.getElementById("signin-link");

if(isLoggedIn === "true"){

    signinLink.style.display = "none";

}

if(logoutBtn){

    logoutBtn.addEventListener("click", function(){

        localStorage.removeItem("loggedIn");

        alert("Logged Out");

        window.location.href = "index.html";

    });

}