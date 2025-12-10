# Frontend — Rendición de Cuentas (Vite + React + TypeScript)

## Descripción

Frontend desarrollado con Vite, React y TypeScript para la aplicación de rendición de cuentas. Provee la interfaz administrativa y pública para:
- Dashboard de administradores
- Gestión de rendiciones y ejes temáticos
- Registro y gestión de preguntas
- Descarga de reportes (Excel) generados por el backend
- Páginas de login/registro y gestión de usuarios

El proyecto está organizado por "features" usando la Screaming Architecture y usa hooks, providers y una capa `core` para la configuración de negocio compartida (API, env, tipos).

---

## Requisitos Previos

- Node.js: recomendada LTS (>= 18)
- npm (>= 8) o yarn / pnpm
- URL del backend (ej. `http://localhost:8080/rendicion/`) disponible para desarrollo
- Git (opcional)

---

## Tecnologías

- Vite (dev server y builder)
- React
- TypeScript
- Axios (configurada en `src/core/config/api.ts`)
- Estructura basada en "Screaming Architecture" (cada funcionalidad en `src/features/*`)

---

## Instalación (local)

Desde la raíz del frontend (`frontend/`):

Windows PowerShell:
```powershell
# Instala dependencias (usa npm, o cambia por yarn/pnpm si prefieres)
npm install
```

Linux / macOS:
```bash
# Instala dependencias (usa npm, o cambia por yarn/pnpm si prefieres)
npm install
```

---

## Scripts comunes
Verifica package.json para confirmar los nombres de scripts. Comandos típicos:

Desarrollo (dev server con hot-reload):

npm run dev o npm run start


Construir para producción:

npm run build

Previsualizar build local (servidor estático):

npm run preview

Lint / format / test (si están definidos):

npm run lint
npm run format
npm run test

---

## Estructura de Carpetas

```plaintext
frontend/
├─ public/                      # Archivos públicos
├─ src/
│  ├─ main.tsx                  # Entrypoint
│  ├─ app/                      # Root app + layouts + routes + providers
│  ├─ core/                     # Config global (api, env, types)
│  │  ├─ config/api.ts          # Axios instance + interceptors
│  │  └─ config/env.ts          # Variables de entorno consolidadas
│  ├─ features/                 # Carpetas por funcionalidad (reportes, admin, login...)
│  │  ├─ reportes/
│  │  ├─ rendicion/
│  │  ├─ dashboard/
│  │  └─ ...
│  ├─ shared/                   # Utilidades compartidas reutilizables
│  └─ assets/
├─ index.html
└─ package.json
```

## Variables de entorno
- VITE_BACKEND_URL — URL base del backend (ejemplo: http://localhost:8080/rendicion/).
- Revisa .env.example para otras variables soportadas por la app.

Recuerda reiniciar el dev server si cambias .env.

## Buenas prácticas y recomendaciones
- Mantén VITE_BACKEND_URL apuntando a tu entorno local durante desarrollo.
- Para producción, reemplaza por la URL real del backend y reconstruye (npm run build).
- Maneja tokens con seguridad: si backend usa JWT en cookie, el frontend debe usar withCredentials: true.
- Maneja errores de red y estado en la UI (toasts / modals).
- Añade pruebas unitarias a hooks y componentes críticos.

## Depuración y consejos
- Problemas de CORS: activa en el backend app/Config/Cors.php o configura proxy en Vite (vite.config.ts) apuntando a VITE_BACKEND_URL.
- Ver responses en DevTools → Network (mira tipo y tamaño del response para descargas).
- Si la app muestra 404 para rutas del backend, verifica app.baseURL del backend y la ruta que está llamando el frontend.

# Despliegue
1. Construir:
npm run build
2. Servir la carpeta dist/ con un servidor estático (Nginx, Apache, Netlify, Vercel, Surge):

3. Configurar VITE_BACKEND_URL en las variables de entorno del hosting (o inyectar en tiempo de construcción).

## Contribuir

- Sigue la estructura feature/ para agregar nuevas funcionalidades.
- Añade hooks reutilizables en src/shared o src/core.
- Escribe tests para hooks y utilitarios.
- Abre pull requests dirigidos a main con descripción y pasos para probar.

## Recursos
- Vite: https://vitejs.dev/
- React: https://reactjs.org/
- TypeScript: https://www.typescriptlang.org/
- PhpSpreadsheet (backend): https://phpspreadsheet.readthedocs.io/
- Axios: https://axios-http.com/

## Contacto
Para problemas con el frontend, provee:

- Versión (commit SHA o branch)
- Pasos para reproducir
- Logs de la consola del navegador y Network
- Configuración de .env (oculta secretos)
