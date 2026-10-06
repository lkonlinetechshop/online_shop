// Shared authentication API helper.
// IMPORTANT: Deploy Google Apps Script as a Web App and put the /exec URL here.
const AUTH_API_URL =
    "https://script.google.com/macros/s/AKfycbwHyVCsqR0YAGI0ZFx37fcPF2IOM5I5KoEWXJRK62QaCg45HR2Wxg6T49o-IctuqUi-/exec";

async function authRequest(action, data = {}) {
    const response = await fetch(AUTH_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({ action, ...data })
    });

    if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
    }

    const result = await response.json();

    if (!result || typeof result.success !== "boolean") {
        throw new Error("Invalid server response.");
    }

    return result;
}

function saveSession(sessionToken) {
    if (!sessionToken) return;
    localStorage.setItem("sessionToken", sessionToken);
}

function getSessionToken() {
    return localStorage.getItem("sessionToken");
}

function clearSession() {
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("user");
    localStorage.removeItem("loggedIn"); // Remove old version's flag too.
}
