# 🟦 AEE – Servicio de Autenticación con API REST + JWT Manual (Node.js)

Actividad realizada para el módulo **DWEC** del ciclo DAW, siguiendo las especificaciones del profesor **Carlos Basulto**.  
El objetivo es implementar un sistema básico de autenticación usando:

✅ Node.js + Express  
✅ API REST  
✅ JWT manual (sin librerías externas)  
✅ HTML + CSS + JavaScript (fetch + localStorage)  
✅ Control de acceso a rutas protegidas  

---

# 📌 1. Objetivo de la Aplicación

La aplicación permite:

- Iniciar sesión con usuario y contraseña.
- Generar un **JWT manual** (Base64URL, sin firma criptográfica).
- Acceder a una pantalla protegida solo si el token es válido.
- Mostrar un mensaje personalizado y la hora actual.
- Denegar el acceso si:
  - No envías token
  - El token es inválido
  - El token está manipulado
  - El token ha expirado
- Cerrar sesión eliminando el token del navegador.

---

# 📌 2. Tecnologías utilizadas

| Parte | Tecnología |
|-------|------------|
| Backend | Node.js + Express |
| Token | JWT manual (header + payload + firma codificada en Base64URL) |
| Frontend | HTML, CSS, JavaScript |
| Autenticación | localStorage + Authorization Bearer |
| Validación | Middleware personalizado |

---

# 📌 3. Estructura del Proyecto

