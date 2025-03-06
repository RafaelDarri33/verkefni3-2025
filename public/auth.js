document.addEventListener("DOMContentLoaded", () => {
    const loginUsername = document.getElementById("login-username");
    const loginPassword = document.getElementById("login-password");
    const loginBtn = document.getElementById("login-btn");

    const registerUsername = document.getElementById("register-username");
    const registerPassword = document.getElementById("register-password");
    const registerBtn = document.getElementById("register-btn");
    const showRegister = document.getElementById("show-register");

    if (localStorage.getItem("loggedInUser")) {
        window.location.href = "quiz.html";
    }

    showRegister.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("register-container").classList.toggle("hide");
    });

    registerBtn.addEventListener("click", () => {
        const username = registerUsername.value.trim();
        const password = registerPassword.value.trim();

        if (!username || !password) {
            alert("Vinsamlegast fylltu út notandanafn og lykilorð.");
            return;
        }

        if (localStorage.getItem(username)) {
            alert("Þessi notandi er þegar til!");
            return;
        }

        localStorage.setItem(username, password);
        alert("Aðgangur búinn til! Þú getur nú skráð þig inn.");
    });

    loginBtn.addEventListener("click", () => {
        const username = loginUsername.value.trim();
        const password = loginPassword.value.trim();

        if (!username || !password) {
            alert("Vinsamlegast fylltu út notandanafn og lykilorð.");
            return;
        }

        const storedPassword = localStorage.getItem(username);
        if (storedPassword === password) {
            localStorage.setItem("loggedInUser", username);
            window.location.href = "quiz.html"; 
        } else {
            alert("Rangt notandanafn eða lykilorð!");
        }
    });
});