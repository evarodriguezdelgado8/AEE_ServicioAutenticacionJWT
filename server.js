const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir pantallas
app.use(express.static(path.join(__dirname, "pantallas")));

// Usuarios permitidos
const usuarios = [
  { username: "admin", password: "1234" },
  { username: "user", password: "abcd" }
];

// --------------------------
// FUNCIONES JWT MANUAL
// --------------------------
function base64urlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64urlDecode(b64url) {
  let base64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) base64 += "=";
  return Buffer.from(base64, "base64").toString();
}

function crearJWT(username) {
  const header = { alg: "none", typ: "JWT" };
  const payload = {
    username,
    exp: Date.now() + 3600000
  };

  const headerB64 = base64urlEncode(JSON.stringify(header));
  const payloadB64 = base64urlEncode(JSON.stringify(payload));

  // Firma ORIGINAL = "header.payload"
  const firmaOriginal = `${headerB64}.${payloadB64}`;

  // Firma codificada para evitar PUNTOS
  const firmaSegura = base64urlEncode(firmaOriginal);

  // Token final válido con 3 PARTES reales:
  // header.payload.firmaCodificada
  return `${headerB64}.${payloadB64}.${firmaSegura}`;
}

// --------------------------
// VALIDACIÓN
// --------------------------
function validarToken(req, res, next) {
  const auth = req.headers["authorization"];

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(403).json({ error: "Token no enviado" });
  }

  const token = auth.split(" ")[1];
  const partes = token.split(".");

  if (partes.length !== 3) {
    return res.status(403).json({ error: "Token mal formado" });
  }

  const [headerB64, payloadB64, firma] = partes;

  // Verificar firma codificada
  const firmaDecodificada = base64urlDecode(firma);
  const firmaOriginal = `${headerB64}.${payloadB64}`;

  if (firmaDecodificada !== firmaOriginal) {
    return res.status(403).json({ error: "Firma no válida" });
  }

  try {
    const payloadStr = base64urlDecode(payloadB64);
    const payload = JSON.parse(payloadStr);

    if (payload.exp < Date.now()) {
      return res.status(403).json({ error: "Token expirado" });
    }

    req.username = payload.username;
    next();

  } catch (e) {
    return res.status(403).json({ error: "Token inválido" });
  }
}

// --------------------------
// LOGIN
// --------------------------
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = usuarios.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  const token = crearJWT(username);
  console.log("TOKEN GENERADO:", token);

  res.json({
    token,
    username
  });
});

// --------------------------
// WELCOME PROTEGIDO
// --------------------------
app.get("/api/welcome", validarToken, (req, res) => {
  const ahora = new Date().toLocaleTimeString("es-ES");

  res.json({
    mensaje: `Bienvenido, ${req.username}`,
    hora: ahora,
    extra: "Acceso permitido al área protegida."
  });
});


// Redirigir raíz "/" a login.html
app.get("/", (req, res) => {
    res.redirect("/login.html");
});
// --------------------------
// INICIO SERVIDOR
// --------------------------
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
