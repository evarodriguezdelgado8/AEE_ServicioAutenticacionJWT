// Escuchamos el evento "submit" del formulario de login
document.getElementById("loginForm").addEventListener("submit", async (e) => {

    // Evita que el formulario recargue la página automáticamente
    e.preventDefault();

    // Obtenemos los valores introducidos por el usuario
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Enviamos la petición POST al servidor con las credenciales del usuario
    const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",                     // Método HTTP usado
        headers: { "Content-Type": "application/json" }, // Indicamos que enviamos JSON
        body: JSON.stringify({ username, password })     // Cuerpo de la petición
    });

    // Si el servidor responde con error 401 → credenciales incorrectas
    if (res.status === 401) {
        document.getElementById("msg").textContent = "Credenciales incorrectas";
        return; // Detenemos la ejecución para no continuar
    }

    // Convertimos la respuesta del servidor en JSON
    const data = await res.json();

    // Guardamos el token y el nombre de usuario en localStorage
    // Esto nos permitirá identificarnos en rutas protegidas
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);

    // Redirigimos al usuario a la pantalla de bienvenida
    window.location.href = "welcome.html";
});
