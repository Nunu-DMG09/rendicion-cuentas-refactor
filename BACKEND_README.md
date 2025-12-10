# Backend - Sistema de Rendición de Cuentas

## Descripción

El backend es un sistema desarrollado en CodeIgniter 4 que gestiona la rendición de cuentas municipal. El sistema maneja:

- Gestión de Administradores
- Gestión de Rendiciones
- Gestión de Usuarios y Asistencia
- Gestión de Ejes Temáticos
- Gestión de Preguntas y Selección
- Generación de Reportes en Excel

Cada módulo mantiene su propia lógica de negocio mientras comparte recursos comunes como autenticación JWT, generación de reportes y helpers.

## Requisitos Previos

- PHP: >= 8.1
- Composer: >= 2.0
- MySQL: >= 5.7 o MariaDB >= 10.3
- Servidor Web: Apache o Nginx
- XAMPP, WAMP o LAMP (opcional para desarrollo local)

## Tecnologías Utilizadas

### Framework Principal

- CodeIgniter ^4.5
- PHP 8.1+

### Librerías y Paquetes

- PhpSpreadsheet: Para la generación de archivos Excel (.xlsx).
- Firebase JWT: Para la autenticación basada en tokens JWT (helper personalizado).
- PHPUnit: Para pruebas unitarias.

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Nunu-DMG09/rendicion-cuentas-refactor.git
   cd rendicion-cuentas-refactor/backend
   ```
2. Instala las dependencias de PHP:
   ```bash
   composer install
   ```
3. Configura el archivo `.env`, copia el archivo `.env.example` y renombralo a `.env`. Modifica las siguientes líneas según tu configuración:
   ```ini
   database.default.hostname = localhost
   database.default.database = rendicion_cuenta
   database.default.username = root
   database.default.password =
   database.default.DBDriver = MySQLi
   
   app.baseURL = http://localhost:8080/
   
   # JWT
   JWT_SECRET = TU_SECRET_JWT
   JWT_EXP = 3600
   ```
4. Crea la base de datos e importa el esquema:
   ```bash
   php spark migrate
   ```
5. (Opcional) Si deseas poblar la base de datos con datos iniciales:
   ```bash
   php spark db:seed RendicionSeeder
   ```
6. Prueba el servidor:
   ```bash
   php spark serve
   ```
   Accede a `http://localhost:8080/`.

## Estructura de Carpetas

El backend sigue una estructura de carpetas organizada:

```
backend/
├── app/
│   ├── Config/                    # Configuraciones del framework
│   │   ├── App.php                # Configuración general de la aplicación
│   │   ├── Database.php           # Configuración de base de datos
│   │   ├── Routes.php             # Definición de rutas
│   │   ├── Cors.php               # Configuración CORS
│   │   └── ...
│   ├── Controllers/               # Controladores del sistema
│   │   ├── [AdministradorController.php](http://_vscodecontentref_/0)
│   │   ├── HistorialAdminController.php
│   │   ├── RendicionController.php
│   │   ├── UsuarioController.php
│   │   ├── EjeController.php
│   │   ├── PreguntaController.php
│   │   ├── SeleccionController.php
│   │   └── AuthController.php
│   ├── Models/                    # Modelos del sistema
│   │   ├── AdministradorModel.php
│   │   ├── HistorialAdminModel.php
│   │   ├── RendicionModel.php
│   │   ├── UsuarioModel.php
│   │   ├── EjeModel.php
│   │   ├── EjeSeleccionadoModel.php
│   │   ├── PreguntaModel.php
│   │   ├── PreguntaSeleccionadaModel.php
│   │   └── BanerRendicionModel.php
│   ├── Database/
│   │   ├── Migrations/            # Migraciones de BD
│   │   └── Seeds/                 # Datos iniciales
│   ├── Helpers/                   # Funciones auxiliares
│   │   └── jwt_helper.php         # Helper JWT personalizado
│   ├── Filters/                   # Filtros de autenticación
│   ├── Libraries/                 # Librerías personalizadas
│   └── Views/                     # Plantillas y vistas
├── public/                        # Punto de entrada web
│   ├── index.php                  # Punto de entrada principal
│   ├── rendicion_excel/           # Archivos Excel generados
│   └── uploads/                   # Archivos subidos
├── writable/                      # Archivos temporales y logs
│   ├── logs/                      # Logs del sistema
│   ├── cache/                     # Caché
│   ├── session/                   # Sesiones
│   └── debugbar/                  # Debug bar
└── vendor/                        # Dependencias de Composer

```

## Uso de las APIs

El sistema expone varias APIs para interactuar con los diferentes módulos:

- **Autenticación**: `POST /login`
- **Reportes**: `GET /reportes`, `GET /reportes/{id}`, etc.
- **Administradores**: `GET /admin`, `POST /admin`, etc.

Ejemplo de cómo realizar una llamada a la API usando `curl`:

```bash
curl -X GET http://localhost:8080/reportes -H "Authorization: Bearer TU_TOKEN_JWT"
```

## Notas Adicionales

- Para entornos de producción, revisa y ajusta las configuraciones de seguridad, rendimiento y conexión a la base de datos.
- Consulta la documentación oficial de CodeIgniter 4 y PhpSpreadsheet para personalizaciones y optimizaciones avanzadas.

## Cambio de Contraseña

Para cambiar la contraseña de un administrador, envía una solicitud con el siguiente formato:

```json
{
  "action": "change_password",
  "password": "NuevaClave123",
  "motivo": "Cambio por seguridad",
  "realizado_por": 1
}
```

## Cambio de Rol

Para cambiar el rol de un administrador, envía una solicitud con el siguiente formato:

```json
{
  "action": "edit_role",
  "categoria": "super_admin",
  "motivo": "Promoción",
  "realizado_por": 1
}
```


```json
{
  "action": "habilitar",
  "motivo": "Reactivación de cuenta",
  "realizado_por": 1
}
```
## Logs y Depuración

* Logs ubicados en writable/logs/
* Debugbar disponible en writable/debugbar/ (si está habilitado)
*Configurar nivel de log en app/Config/Logger.php

## Seguridad
* No se devuelve el campo password en ninguna respuesta del API
* JWT almacenado en cookies HTTP-only
* Validación de entrada en todos los endpoints
* Soft delete para administradores
* CORS configurado en app/Config/Cors.php

## Soporte y Mantenimiento
Para modificaciones específicas de cada módulo:

* Administradores: Editar AdministradorController.php y app/Models/AdministradorModel.php
* Historial: Editar app/Controllers/HistorialAdminController.php
* Rendiciones: Editar app/Controllers/RendicionController.php y app/Models/RendicionModel.php
* Usuarios: Editar app/Controllers/UsuarioController.php y app/Models/UsuarioModel.php
* Ejes y Preguntas: Editar controladores y modelos respectivos

## Licencia
Ver archivo LICENSE en la raíz del proyecto.


