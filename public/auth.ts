document.addEventListener("DOMContentLoaded", () => {
    const loginUsername = <HTMLInputElement>document.getElementById("login-username");
    const loginPassword = <HTMLInputElement>document.getElementById("login-password");
    const loginBtn = <HTMLButtonElement>document.getElementById("login-btn");

    const registerUsername = <HTMLInputElement>document.getElementById("register-username");
    const registerPassword = <HTMLInputElement>document.getElementById("register-password");
    const registerBtn = <HTMLButtonElement>document.getElementById("register-btn");
    const showRegister = <HTMLAnchorElement>document.getElementById("show-register");

    if (localStorage.getItem("loggedInUser")) {
        window.location.href = "quiz.html";
    }

    showRegister.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("register-container")?.classList.toggle("hide");
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
