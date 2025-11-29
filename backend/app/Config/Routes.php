<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('rendicion', ['namespace' => 'App\Controllers'], function($routes) {

    // Buscar documento

    $routes->get('dni/(:segment)', 'Api::buscarDNI/$1');
    $routes->get('ruc/(:segment)', 'Api::buscarRUC/$1');

    // Rendición
    $routes->get('/', 'RendicionController::listarRendiciones');
    $routes->get('/(:num)', 'RendicionController::obtenerRendicion/$1');
    $routes->post('/', 'RendicionController::crearRendicion');
    $routes->post('/asociar-ejes', 'RendicionController::asociarEjes');
    $routes->get('(:num)/participantes', 'RendicionController::participantes/$1');

    // Ejes
    $routes->get('eje/', 'EjeController::listarEjes');
    $routes->post('eje', 'EjeController::crearEje');

    // Usuarios
    $routes->post('usuarios', 'UsuarioController::registrarUsuario');
    $routes->put('usuarios/(:num)/asistencia', 'UsuarioController::marcarAsistencia/$1');
    $routes->get('rendiciones/(:num)/usuarios', 'UsuarioController::usuariosPorRendicion/$1');
    $routes->get('usuarios/asistentes', 'UsuarioController::listarAsistentes');
    $routes->get('usuarios/oradores', 'UsuarioController::listarOradores');
    $routes->post('usuarios/asignar', 'UsuarioController::asignarARendicion');

    // Preguntas
    $routes->post('preguntas', 'PreguntaController::crearPregunta');
    $routes->get('ejes/(:num)/preguntas', 'PreguntaController::preguntasPorEje/$1');
    $routes->get('rendiciones/(:num)/preguntas', 'PreguntaController::preguntasPorRendicion/$1');
    $routes->get('preguntas/fecha/(:segment)', 'PreguntaController::preguntasPorFechaRendicion/$1');

    // Selección de preguntas
    $routes->post('selecciones', 'SeleccionController::seleccionarPregunta');
    $routes->get('eje-seleccionado/(:num)', 'SeleccionController::preguntasSeleccionadasPorEjeSeleccionado/$1');

    // Historial admin
    $routes->get('historial', 'HistorialAdminController::listarHistorial');
    $routes->get('historial/admin/(:num)', 'HistorialAdminController::historialPorAdministrador/$1');

    // Administradores
    $routes->get('admin', 'AdministradorController::listarAdministradores');
    $routes->get('admin/dni/(:segment)', 'AdministradorController::buscarPorDNI/$1');
    $routes->post('admin', 'AdministradorController::crearAdministrador');
    $routes->put('admin/(:num)', 'AdministradorController::ActualizarAdministrador/$1');
    $routes->delete('admin/(:num)', 'AdministradorController::eliminarAdministrador/$1');

    // Autenticación
    $routes->post('auth/login', 'AuthController::login');
    $routes->post('auth/logout', 'AuthController::logout');
    $routes->get('auth/refresh', 'AuthController::refresh');
    $routes->get('auth/test', 'AuthController::testFilter');
});
