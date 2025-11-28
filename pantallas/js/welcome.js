// Obtenemos el token almacenado en localStorage
const token = localStorage.getItem("token");

// Si no existe token, redirigimos al usuario a la página de acceso denegado
if (!token) {
    window.location.href = "denied.html";
}

// Función asíncrona para cargar los datos desde la API
async function cargarDatos() {
    // Hacemos una petición GET a la API, incluyendo el token en la cabecera Authorization
    const res = await fetch("http://localhost:3000/api/welcome", {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    // Si la respuesta es 403 (prohibido), redirigimos a la página de acceso denegado
    if (res.status === 403) {
        window.location.href = "denied.html";
        return; // Salimos de la función
    }

    // Convertimos la respuesta en JSON
    const data = await res.json();

    // Mostramos los datos obtenidos en los elementos del HTML correspondientes
    document.getElementById("mensaje").textContent = data.mensaje;
    document.getElementById("hora").textContent = "Hora actual: " + data.hora;
    document.getElementById("extra").textContent = data.extra;
}

// Llamamos a la función para cargar los datos al cargar la página
cargarDatos();

// Evento para cerrar sesión
document.getElementById("logout").onclick = () => {
    // Eliminamos el token y el nombre de usuario del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // Redirigimos al usuario a la página de login
    window.location.href = "login.html";
};
