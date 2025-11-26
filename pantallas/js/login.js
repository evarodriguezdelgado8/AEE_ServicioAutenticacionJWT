document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (res.status === 401) {
        document.getElementById("msg").textContent = "Credenciales incorrectas";
        return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);

    window.location.href = "welcome.html";
});
