<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->group('rendicion',  ['namespace' => 'App\Controllers', 'filter' => 'cors'], static function($routes) {
    $routes->options('(:any)', static function () {});

    // Buscar documento
    $routes->get('dni/(:segment)', 'Api::buscarDNI/$1'); // Busca datos por DNI
    $routes->get('ruc/(:segment)', 'Api::buscarRUC/$1'); // Busca datos por RUC

    // Rendición
    $routes->get('/', 'RendicionController::listarRendiciones'); // Lista todas las rendiciones
    $routes->get('/(:num)', 'RendicionController::obtenerRendicion/$1'); // Obtiene rendición por id
    $routes->post('/', 'RendicionController::crearRendicion'); // Crea nueva rendición (acepta archivos)
    $routes->post('/asociar-ejes', 'RendicionController::asociarEjes'); // Asocia ejes a una rendición
    $routes->get('(:num)/participantes', 'RendicionController::participantes/$1'); // Participantes de una rendición
    $routes->get('rendiciones', 'RendicionController::recientes');
    $routes->post('(:num)', 'RendicionController::editarRendicion/$1'); // Actualiza rendición (acepta archivos)
   
    $routes->get('preguntas-seleccionadas/(:num)', 'RendicionController::preguntasSeleccionadas/$1'); // preguntas seleccionadas por rendición (home/admin)

    // RUTAS ACTUALES LO QUE ME PEDISTE QUE AGREGUE @DIEGAZO OÑO
    $routes->get('home/banners', 'RendicionController::banners'); // Obtiene los banners de la rendición más reciente
    $routes->get('home/datos-registro', 'RendicionController::datosRegistro');  // Obtiene datos de la rendición actual para el formulario de registro
    $routes->get('home/rendiciones', 'RendicionController::rendiciones'); // Obtiene todas las rendiciones del año actual con sus preguntas para mostrar en home


     // Ejes
    $routes->get('ejes', 'EjeController::listarEjes'); // Lista ejes temáticos
    $routes->post('ejes', 'EjeController::crearEje'); // Crea un nuevo eje
    $routes->put('ejes/(:num)', 'EjeController::toggleEjeEstado/$1'); // Habilita o deshabilita un eje

    // Usuarios
    $routes->post('usuarios', 'UsuarioController::registrarUsuario'); // Registra usuario
    $routes->post('usuarios/(:num)', 'UsuarioController::registrarUsuario/$1'); // Registra usuario con rendición específica
    $routes->put('usuarios/(:num)/asistencia', 'UsuarioController::marcarAsistencia/$1'); // Marcar asistencia
    $routes->get('rendiciones/(:num)/usuarios', 'UsuarioController::usuariosPorRendicion/$1'); // Usuarios por rendición
    $routes->get('usuarios/asistentes', 'UsuarioController::listarAsistentes'); // Lista asistentes
    $routes->get('usuarios/oradores', 'UsuarioController::listarOradores'); // Lista oradores
    $routes->post('usuarios/asignar', 'UsuarioController::asignarARendicion'); // Asignar usuario a rendición
    $routes->get('usuarios/fecha/(:segment)', 'UsuarioController::usuariosPorFechaRendicion/$1'); // Usuarios por fecha de rendición
    // Preguntas
    $routes->post('preguntas', 'PreguntaController::crearPregunta'); // Crear pregunta
    $routes->get('ejes/(:num)/preguntas', 'PreguntaController::preguntasPorEje/$1'); // Preguntas por eje
    $routes->get('rendiciones/(:num)/preguntas', 'PreguntaController::preguntasPorRendicion/$1'); // Preguntas por rendición
    $routes->get('preguntas/fecha/(:segment)', 'PreguntaController::preguntasPorFechaRendicion/$1'); // Preguntas por fecha

    // Selección de preguntas
    $routes->post('selecciones', 'SeleccionController::seleccionarPregunta'); // Seleccionar pregunta
    $routes->get('eje-seleccionado/(:num)', 'SeleccionController::preguntasSeleccionadasPorEjeSeleccionado/$1'); // Preguntas seleccionadas por eje_seleccionado

    // Historial admin
    $routes->get('historial', 'HistorialAdminController::listarHistorial'); // Lista historial de acciones admin
    $routes->get('historial/admin/(:num)', 'HistorialAdminController::historialPorAdministrador/$1'); // Historial por administrador

    // Administradores
    $routes->get('admin', 'AdministradorController::listarAdministradores'); // Lista administradores
    $routes->get('admin/dni/(:segment)', 'AdministradorController::buscarPorDNI/$1'); // Buscar admin por DNI
    $routes->post('admin', 'AdministradorController::crearAdministrador'); // Crear administrador
    $routes->put('admin/(:num)', 'AdministradorController::ActualizarAdministrador/$1'); // Actualizar administrador
    $routes->delete('admin/(:num)', 'AdministradorController::eliminarAdministrador/$1'); // Eliminar administrador
    $routes->get('admin/dashboard', 'AdministradorController::DashboardStatistics');
    $routes->get('admin/rendiciones', 'AdministradorController::rendicionesList'); // lista rendiciones (id + titulo) con ?query=
    $routes->get('admin/preguntas/(:num)', 'AdministradorController::preguntasConSeleccion/$1');
    $routes->post('admin/preguntas/seleccionar', 'AdministradorController::seleccionarPreguntas'); // Seleccionar/deseleccionar preguntas
    
    // Autenticación
    $routes->post('auth/login', 'AuthController::login'); // Login (obtener token)
    $routes->post('auth/logout', 'AuthController::logout'); // Logout (invalidar token)
    $routes->get('auth/refresh', 'AuthController::refresh'); // Refrescar token
    $routes->get('auth/test', 'AuthController::testFilter'); // Ruta de prueba con filtro auth
});
