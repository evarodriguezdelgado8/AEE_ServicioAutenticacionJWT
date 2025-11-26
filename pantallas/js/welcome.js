// Si no hay token => denegado
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "denied.html";
}

async function cargarDatos() {
    const res = await fetch("http://localhost:3000/api/welcome", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (res.status === 403) {
        window.location.href = "denied.html";
        return;
    }

    const data = await res.json();

    document.getElementById("mensaje").textContent = data.mensaje;
    document.getElementById("hora").textContent = "Hora actual: " + data.hora;
    document.getElementById("extra").textContent = data.extra;
}

cargarDatos();

// Cerrar sesión
document.getElementById("logout").onclick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "login.html";
};
