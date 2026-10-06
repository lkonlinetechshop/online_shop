const isLoggedIn =
    localStorage.getItem("loggedIn");


const userStatus =
    document.getElementById(
        "user-status"
    );


const logoutBtn =
    document.getElementById(
        "logout-btn"
    );


const signinLink =
    document.getElementById(
        "signin-link"
    );


/**
 * Check logged-in user
 */
if (
    isLoggedIn === "true"
) {

    const savedUser =
        localStorage.getItem("user");


    if (savedUser) {

        try {

            const user =
                JSON.parse(
                    savedUser
                );


            if (userStatus) {

                userStatus.textContent =
                    `Welcome, ${user.name}`;

            }


            if (logoutBtn) {

                logoutBtn.style.display =
                    "flex";

            }


            if (signinLink) {

                signinLink.style.display =
                    "none";

            }

        } catch (error) {

            console.error(
                "Could not read user data:",
                error
            );

        }

    }

}


/**
 * Logout
 */
if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "loggedIn"
            );


            localStorage.removeItem(
                "user"
            );


            alert(
                "Logged Out"
            );


            window.location.href =
                "index.html";

        }
    );

}
