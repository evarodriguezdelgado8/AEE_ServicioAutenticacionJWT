# 🟦 AEE – Servicio de Autenticación con API REST + JWT Manual (Node.js)

Actividad desarrollada para el módulo **DWEC** del ciclo **DAW**, siguiendo las especificaciones del profesor **Carlos Basulto Pardo**.

El objetivo es construir un sistema básico de autenticación mediante una **API REST** y un **JWT manual**, sin librerías externas, usando únicamente:

- Node.js + Express  
- HTML + CSS + JavaScript  
- localStorage  
- fetch API  
- Middleware de validación propio  

---

# 📌 1. Funcionalidades de la Aplicación

La aplicación permite:

### 🔐 Autenticación
- Pantalla de login con usuario y contraseña.
- Validación en el servidor mediante un array de usuarios predefinidos.
- Generación de un **JWT manual**:
  - Header codificado en Base64URL
  - Payload codificado en Base64URL
  - Firma basada en `header.payload` codificada en Base64URL
  - Sin criptografía (solo fines educativos)

### 🛡 Rutas protegidas
- Endpoint `/api/welcome` accesible **solo con token válido**.
- Comprobación de:
  - Estructura del token (3 partes)
  - Firma válida
  - Token no manipulado
  - No expirado

### 👤 Pantalla de bienvenida
- Muestra:
  - Usuario autenticado
  - Hora actual
  - Mensaje adicional

### ❌ Control de errores
- Si el token es inválido → redirige a **denied.html**
- Si no hay token → redirige a **denied.html**
- Si el token expira → redirige a **denied.html**

### 🚪 Cerrar sesión
- Botón en welcome
- Borra el token del localStorage
- Redirige al login

---

# 📌 2. Tecnologías utilizadas

| Área | Tecnología |
|------|------------|
| Backend | Node.js + Express |
| Token | JWT Manual (Base64URL) |
| Rutas protegidas | Middleware personalizado |
| Cliente | HTML + CSS + JavaScript |
| Autenticación | localStorage + Fetch API |
| Comunicación | JSON |

---

# 📌 3. Estructura del Proyecto

```
AEE_ServicioAutenticacionJWT/
│
├── server.js
├── package.json
│
└── pantallas/
    ├── login.html
    ├── welcome.html
    ├── denied.html
    │
    ├── css/
    │   └── estilos.css
    │
    └── js/
        ├── login.js
        └── welcome.js
```

---

# 📌 4. Instalación y ejecución

### 1️⃣ Instalar dependencias
```
npm install
```

### 2️⃣ Iniciar servidor
```
npm start
```

### 3️⃣ Abrir navegador
```
http://localhost:3000/login.html
```

---

# 📌 5. Endpoints de la API

## 🔹 `POST /api/login`
Autentica al usuario.

### ➤ Enviar:
```json
{
  "username": "admin",
  "password": "1234"
}
```

### ➤ Respuesta correcta:
```json
{
  "token": "HEADER.PAYLOAD.FIRMA",
  "username": "admin"
}
```

### ➤ Errores:
- `401` → Credenciales incorrectas

---

## 🔹 `GET /api/welcome` (protegido)

### ➤ Requiere cabecera:
```
Authorization: Bearer <token>
```

### ➤ Respuesta correcta:
```json
{
  "mensaje": "Bienvenido, admin",
  "hora": "13:45:22",
  "extra": "Acceso permitido al área protegida."
}
```

### ➤ Errores:
- `403` token inválido  
- `403` token manipulado  
- `403` token expirado  

---

# 📌 6. Usuarios disponibles

```
admin / 1234
user  / abcd
```

---

# 📌 7. Funcionamiento del JWT Manual

El token se construye así:

```
HEADER.Payload.FIRMA
```

### 1️⃣ Header (JSON)
```json
{
  "alg": "none",
  "typ": "JWT"
}
```

### 2️⃣ Payload (JSON)
```json
{
  "username": "admin",
  "exp": 1893456000
}
```

### 3️⃣ Codificación Base64URL
```
headerB64 = Base64URL(header)
payloadB64 = Base64URL(payload)
```

### 4️⃣ Firma educativa (no criptográfica)
```
firmaOriginal = headerB64 + "." + payloadB64
firmaSegura = Base64URL(firmaOriginal)
```

### 5️⃣ Token final
```
headerB64.payloadB64.firmaSegura
```

---

# 📌 8. Flujo completo

### 🔹 1. El usuario inicia sesión  
→ Envío por fetch  
→ Validación correcta  
→ Servidor genera JWT manual  
→ Token guardado en localStorage

### 🔹 2. Entra en welcome.html  
→ JS envía token por Authorization Bearer  
→ Middleware valida token  
→ Si es válido → entra  
→ Si no → denied.html

### 🔹 3. Cerrar sesión  
→ Borra token y usuario  
→ Redirige al login

---

# 📌 9. Capturas recomendadas (opcional)

📸 Login  
📸 Bienvenida  
📸 Denied  
📸 Consola con token generado  

*(Puedes añadirlas directamente desde GitHub.)*

---

# 📌 10. Autor

Proyecto desarrollado por **Eva Rodríguez Delgado**, alumna de **2º DAW**.

---

# 🎉 FIN DEL README
Este README cumple:

✔ Bonito  
✔ Completo  
✔ Profesional  
✔ Forma parte de un proyecto real  
✔ Ideal para entregar al profesor o subir a GitHub  
