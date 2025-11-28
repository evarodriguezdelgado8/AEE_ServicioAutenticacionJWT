/********************************************************************
 *  AEE – Servicio de Autenticación con API REST + JWT Manual
 *  Módulo: DWEC - Desarrollo Web Entorno Cliente
 *  Alumna: (Tu nombre)
 *  Profesor: Carlos Basulto
 * 
 *  Este servidor implementa un sistema básico de autenticación con:
 *  - Node.js + Express
 *  - API REST
 *  - JWT manual sin librerías externas
 *  - Validación mediante Base64URL
 * 
 *  El objetivo es simular un sistema de login real:
 *  1) El usuario inicia sesión -> se genera un JWT manual
 *  2) El cliente guarda el token en localStorage
 *  3) El token se envía en Authorization: Bearer <token>
 *  4) Solo si es válido se accede a /api/welcome
 ********************************************************************/

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// -----------------------------------------------------------
// MIDDLEWARE PRINCIPAL
// -----------------------------------------------------------

// Habilita solicitudes desde el navegador (fetch)
app.use(cors());

// Permite recibir JSON en peticiones POST
app.use(express.json());

// Servir los archivos HTML, CSS y JS desde /pantallas
app.use(express.static(path.join(__dirname, "pantallas")));


// -----------------------------------------------------------
// BASE DE DATOS SIMULADA (ARRAY DE USUARIOS)
// -----------------------------------------------------------
const usuarios = [
  { username: "admin", password: "1234" },
  { username: "user",  password: "abcd" }
];


// -----------------------------------------------------------
// FUNCIONES PARA CREAR Y LEER JWT MANUAL
// -----------------------------------------------------------

/**
 * Codifica un string en Base64URL (versión segura de Base64)
 */
function base64urlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")   // elimina "="
    .replace(/\+/g, "-") // "+" -> "-"
    .replace(/\//g, "_"); // "/" -> "_"
}

/**
 * Decodifica un Base64URL a texto normal
 */
function base64urlDecode(b64url) {
  let base64 = b64url.replace(/-/g, "+").replace(/_/g, "/");

  // El padding es necesario para decodificar correctamente
  while (base64.length % 4 !== 0) base64 += "=";

  return Buffer.from(base64, "base64").toString();
}

/**
 * Genera un JWT manual compuesto por:
 *  header.payload.signatureCodificada
 * 
 * La firma se genera concatenando:
 *  headerBase64 + "." + payloadBase64
 * 
 * Y luego codificándola para que no tenga puntos.
 */
function crearJWT(username) {
  const header = { alg: "none", typ: "JWT" };
  const payload = {
    username,
    exp: Date.now() + 3600000 // expira en 1 hora
  };

  const headerB64  = base64urlEncode(JSON.stringify(header));
  const payloadB64 = base64urlEncode(JSON.stringify(payload));

  // Firma original: "header.payload"
  const firmaOriginal = `${headerB64}.${payloadB64}`;

  // Firma codificada sin puntos → más segura para manejo manual
  const firmaSegura = base64urlEncode(firmaOriginal);

  // Token final con 3 partes (estándar JWT)
  return `${headerB64}.${payloadB64}.${firmaSegura}`;
}


// -----------------------------------------------------------
// MIDDLEWARE PARA VALIDAR TOKENS
// -----------------------------------------------------------

/**
 * Verifica:
 *  - Que el header Authorization existe
 *  - Que el token tiene 3 partes
 *  - Que la firma coincide
 *  - Que no está expirado
 * 
 * Si todo es correcto -> next()
 * Si no -> 403 Forbidden
 */
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

  // Decodificar firma
  const firmaDecodificada = base64urlDecode(firma);
  const firmaOriginal = `${headerB64}.${payloadB64}`;

  // Validar firma
  if (firmaDecodificada !== firmaOriginal) {
    return res.status(403).json({ error: "Firma no válida" });
  }

  // Validar expiration y username
  try {
    const payloadJSON = base64urlDecode(payloadB64);
    const payload = JSON.parse(payloadJSON);

    if (payload.exp < Date.now()) {
      return res.status(403).json({ error: "Token expirado" });
    }

    req.username = payload.username;
    next();

  } catch (e) {
    return res.status(403).json({ error: "Token inválido" });
  }
}


// -----------------------------------------------------------
// ENDPOINT LOGIN
// -----------------------------------------------------------

/**
 * POST /api/login
 * Recibe: { username, password }
 * Devuelve: { token, username }
 */
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  // Buscar usuario en la "base de datos"
  const user = usuarios.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  // Crear token manual
  const token = crearJWT(username);
  console.log("TOKEN GENERADO:", token);

  res.json({ token, username });
});


// -----------------------------------------------------------
// ENDPOINT PROTEGIDO
// -----------------------------------------------------------

/**
 * GET /api/welcome
 * Necesita token válido
 */
app.get("/api/welcome", validarToken, (req, res) => {
  const horaActual = new Date().toLocaleTimeString("es-ES");

  res.json({
    mensaje: `Bienvenido, ${req.username}`,
    hora: horaActual,
    extra: "Acceso permitido al área protegida."
  });
});


// -----------------------------------------------------------
// REDIRECCIÓN A LOGIN
// -----------------------------------------------------------

app.get("/", (req, res) => {
  res.redirect("/login.html");
});


// -----------------------------------------------------------
// INICIO DEL SERVIDOR
// -----------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
