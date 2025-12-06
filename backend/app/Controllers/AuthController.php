<?php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\AdministradorModel;
use CodeIgniter\Cookie\Cookie;

helper('jwt'); // crea createJWT(), verifyJWT()
helper('cookie');

class AuthController extends ResourceController
{
    protected $format = 'json';
    private $adminModel;

    public function __construct()
    {
        $this->adminModel = new AdministradorModel();
    }

    /*========================================================
     TEST CORS FILTER
     ========================================================*/

    public function testFilter()
    {
        return $this->respond(['message' => 'Filter valid'], 200);
    }

    /*========================================================
     INICIAR SESIÓN
     ========================================================*/

    public function login()
    {
        $json = $this->request->getJSON(true) ?: [];
        $dni = $json['dni'] ?? null;
        $password = $json['password'] ?? null;

        if (!$dni || !$password) {
            return $this->respond(['error' => 'dni y password requeridos'], 400);
        }

        $user = $this->adminModel->findByDni($dni);
        if (!$user || !password_verify($password, $user['password'])) {
            return $this->respond(['error' => 'Credenciales inválidas'], 401);
        }

        if ((string)$user['estado'] === '0') {
            return $this->respond(['error' => 'Tu cuenta está inactiva, contacta con el administrador principal.'], 403);
        }

        $token = createJWT([
            'id' => (int)$user['id'],
            'dni' => $user['dni'],
            'rol' => $user['categoria'],
            'estado' => (string)$user['estado']
        ], 3600);

        $cookie = new Cookie(
            'access_token',
            $token,
            [
                'expires'   => time() + 3600,
                'path'      => '/',
                'secure'    => false,
                'httponly'  => true,
                'samesite'  => Cookie::SAMESITE_LAX,
                'domain'    => ''
            ]
        );
        $response = service('response');
        $response->setCookie($cookie);

        return $response->setJSON([
            'success' => true,
            'role_changed' => false,
            'user' => [
                'id' => (int)$user['id'],
                'dni' => $user['dni'],
                'estado' => $user['estado'],
                'rol' => $user['categoria'],
                'nombre' => $user['nombre'] ?? 'Administrador'
            ]
        ])->setStatusCode(200);
    }

    /*========================================================
     CERRAR SESIÓN
     ========================================================*/

    public function logout()
    {
        $cookie = new Cookie(
            'access_token',
            '',
            [
                'expires' => time() - 3600,
                'path' => '/',
                'domain' => '',
                'httponly' => true,
                'samesite' => Cookie::SAMESITE_LAX
            ]
        );
        service('response')->setCookie($cookie);
        return $this->respond(['message' => 'Sesion cerrada.'], 200);
    }

    /*========================================================
     REFRESCAR TOKEN Y VERIFICAR CAMBIO DE ROL
     ========================================================*/

    public function refresh()
    {
        $token = get_cookie('access_token');
        if (!$token) {
            $this->logout();
            return service('response')->setJSON(['error' => 'Token no válido', 'forceLogout' => true])->setStatusCode(401);
        }

        try {
            $decoded = verifyJWT($token);
            if (!isset($decoded->data) || !isset($decoded->data->dni) || !isset($decoded->data->id) || !isset($decoded->data->rol)) {
                throw new \Exception('Token inválido: datos incompletos');
            }

            $admin = $this->adminModel->findByDni($decoded->data->dni);
            if (!$admin) {
                $this->logout();
                return $this->response->setJSON(['error' => 'Usuario no encontrado', 'forceLogout' => true])->setStatusCode(401);
            }

            $estado = strtolower(trim((string)$admin['estado']));
            if (! in_array($estado, ['1','activo','active','true'], true)) {
                $this->logout();
                return $this->response->setJSON(['error' => 'Tu cuenta ha sido desactivada', 'forceLogout' => true])->setStatusCode(401);
            }

            $roleChanged = ($admin['categoria'] !== $decoded->data->rol);
            if ($roleChanged) {
                $newToken = createJWT([
                    'id' => (int)$admin['id'],
                    'dni' => $admin['dni'],
                    'rol' => $admin['categoria'],
                    'estado' => (string)$admin['estado']
                ], 3600);

                $cookie = new Cookie(
                    'access_token',
                    $newToken,
                    [
                        'expires' => time() + 3600,
                        'path' => '/',
                        'secure' => false,
                        'httponly' => true,
                        'samesite' => Cookie::SAMESITE_LAX,
                        'domain' => ''
                    ]
                );
                service('response')->setCookie($cookie);

                return $this->response->setJSON([
                    'roleChanged' => true,
                    'user' => [
                        'id' => (int)$admin['id'],
                        'dni' => $admin['dni'],
                        'estado' => $admin['estado'],
                        'rol' => $admin['categoria'],
                        'nombre' => $admin['nombre'] ?? 'Administrador'
                    ]
                ])->setStatusCode(200);
            }

            return $this->response->setJSON([
                'roleChanged' => false,
                'user' => [
                    'id' => (int)$admin['id'],
                    'dni' => $admin['dni'],
                    'estado' => $admin['estado'],
                    'rol' => $admin['categoria'],
                    'nombre' => $admin['nombre'] ?? 'Administrador'
                ]
            ])->setStatusCode(200);

        } catch (\Throwable $e) {
            log_message('error', '[REFRESH ERROR] ' . $e->getMessage());
            $this->logout();
            return service('response')->setJSON(['error' => 'Token no válido: ' . $e->getMessage(), 'forceLogout' => true])->setStatusCode(401);
        }
    }
}