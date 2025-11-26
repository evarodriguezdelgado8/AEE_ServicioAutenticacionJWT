const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ✅ Servir las páginas HTML
app.use(express.static(path.join(__dirname, "pantallas")));

// Usuarios simulados (como pide la actividad)
const usuarios = [
  { username: "admin", password: "1234" },
  { username: "user", password: "abcd" }
];

// ----------------------------
// POST /api/login
// ----------------------------
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = usuarios.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  // Token generado con base64_encode (como pide el enunciado)
  const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");

  res.json({
    token: token,
    username: username
  });
});

// Middleware para validar token
function validarToken(req, res, next) {
  const auth = req.headers["authorization"];

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Token no enviado o incorrecto" });
  }

  const token = auth.split(" ")[1];

  // Para esta actividad: aceptar cualquier token Base64 bien formado
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const username = decoded.split(":")[0];

    if (!username) {
      return res.status(403).json({ error: "Token inválido" });
    }

    req.username = username;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido" });
  }
}

// ----------------------------
// GET /api/welcome (protegido)
// ----------------------------
app.get("/api/welcome", validarToken, (req, res) => {
  res.json({
    mensaje: `Bienvenido, ${req.username}`,
    hora: new Date().toLocaleTimeString(),
    extra: "Has accedido correctamente a la zona protegida."
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
