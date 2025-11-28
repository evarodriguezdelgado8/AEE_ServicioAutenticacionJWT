**Servicio de Autenticación con API REST – JWT Manual**

Proyecto para la asignatura Desarrollo Web en Entorno Servidor (DWES / DWEC).

Este proyecto implementa un sistema de autenticación mediante una API REST con un JWT creado manualmente, sin librerías externas, siguiendo los requisitos del profesor.

**Incluye:**

  Pantalla de login
  
  Validación de credenciales
  
  Generación de JWT manual
  
  Ruta protegida /api/welcome
  
  Control de acceso con error 403
  
  Pantalla de acceso denegado
  
  Cerrar sesión
  
  Interfaz estilo tarjeta con CSS moderno

**Tecnologías utilizadas**

  Node.js
  
  Express
  
  CORS
  
  HTML5
  
  CSS3

  JavaScript (fetch, localStorage)

**Estructura del proyecto**
    AEE_ServicioAutenticacionJWT/
    │
    ├── server.js
    ├── package.json
    ├── package-lock.json
    │
    ├── css/
    │   └── estilos.css
    │
    ├── pantallas/
    │   ├── login.html
    │   ├── welcome.html
    │   ├── denied.html
    │   │
    │   │
    │   └── js/
    │       ├── login.js
    │       └── welcome.js

**JWT Manual Implementado**

  Este proyecto NO usa la librería jsonwebtoken.
  El token se genera manualmente.
  
  ✔ Formato del token:
  HEADER.PAYLOAD.FIRMA
  
  ✔ Codificación usada
  
  Se utiliza Base64URL para las tres partes.
  
  ✔ Firma
  
  La firma se genera así:
  
  firmaOriginal = headerB64 + "." + payloadB64
  firmaSegura = base64urlEncode(firmaOriginal)
  
  ✔ Token final
  headerB64.payloadB64.firmaSegura


  Esto evita problemas con caracteres especiales y mantiene compatibilidad con cualquier navegador.

**Instalación**

  Clona o copia el proyecto.
  
  Instala dependencias:
  
  npm install
  
  
  Inicia el servidor:
  
  npm start


  El servidor se abrirá en:
  
  http://localhost:3000

** Usuarios permitidos**
    Usuario	Contraseña
    admin	1234
    user	abcd
    
**Endpoints de la API**
  🔹 POST /api/login

      Envía usuario y contraseña:
      
      {
        "username": "admin",
        "password": "1234"
      }
      
      
      ✔ Devuelve:
      
      {
        "token": "JWT_manual...",
        "username": "admin"
      }

    
      ❌ Si las credenciales son incorrectas:
      401 Unauthorized
    
  🔹 GET /api/welcome
    
    Ruta protegida.
    Requiere:
    
    Authorization: Bearer <token>
    
    
    ✔ Devuelve:
    
    {
      "mensaje": "Bienvenido, admin",
      "hora": "12:34:02",
      "extra": "Acceso permitido al área protegida."
    }
    
    
    ❌ Si el token es inválido o caducado:
    403 Forbidden

🖥️ Funcionamiento de las pantallas
✔ Login (login.html)

Introduce usuario y contraseña

Se envían con fetch

Si es correcto → se guarda token en localStorage

Redirige a welcome.html

✔ Pantalla de bienvenida (welcome.html)

Solicita /api/welcome con el token

Muestra:

Nombre del usuario

Hora actual

Mensaje extra

Botón de cerrar sesión → elimina token y vuelve al login

✔ Acceso denegado (denied.html)

Se muestra si:

No hay token

El token está mal formado

El token está manipulado

El token ha caducado

🎨 Diseño (Tarjetas)

El proyecto usa un diseño moderno basado en tarjetas:

Tarjeta centrada

Sombra suave

Animación de entrada

Botones y campos de entrada estilizados

🔍 Cómo probar el sistema

Abrir:

http://localhost:3000/login.html


Iniciar sesión con admin / 1234.

Verificar:

Redirección correcta

Muestra datos protegidos

Probar logout

Intentar entrar a:

http://localhost:3000/welcome.html


sin token → debe redirigir a denied.html.
