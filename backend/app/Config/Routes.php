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

    // Ejes
    $routes->get('ejes', 'EjeController::listarEjes');
    $routes->post('ejes', 'EjeController::crearEje');

    // Usuarios
    $routes->post('usuarios', 'UsuarioController::registrarUsuario');
    $routes->put('usuarios/(:num)/asistencia', 'UsuarioController::marcarAsistencia/$1');
    $routes->get('rendiciones/(:num)/usuarios', 'UsuarioController::usuariosPorRendicion/$1');

    // Preguntas
    $routes->post('preguntas', 'PreguntaController::crearPregunta');
    $routes->get('ejes/(:num)/preguntas', 'PreguntaController::preguntasPorEje/$1');
    $routes->get('rendiciones/(:num)/preguntas', 'PreguntaController::preguntasPorRendicion/$1');

    // Selección de preguntas
    $routes->post('selecciones', 'SeleccionController::seleccionarPregunta');
    $routes->get('eje-seleccionado/(:num)/preguntas', 'SeleccionController::preguntasSeleccionadasPorEjeSeleccionado/$1');

    // Historial admin
    $routes->get('historial', 'HistorialAdminController::listarHistorial');
    $routes->get('historial/admin/(:num)', 'HistorialAdminController::historialPorAdministrador/$1');
});
