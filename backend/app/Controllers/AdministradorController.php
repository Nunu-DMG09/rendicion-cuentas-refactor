<?php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\AdministradorModel;
use App\Models\HistorialAdminModel;

helper('cookie');
helper('jwt');

class AdministradorController extends ResourceController
{
    protected $format = 'json';

    private function authAdmin()
    {
        $token = get_cookie('access_token');

        if (!$token) {
            return $this->respond(['error' => 'No autenticado'], 401);
        }

        try {
            $decoded = verifyJWT($token);

            if (!isset($decoded->data->dni)) {
                return $this->respond(['error' => 'Token inválido'], 401);
            }

            $adminModel = new \App\Models\AdministradorModel();
            $admin = $adminModel->where('dni', $decoded->data->dni)->first();

            if (!$admin) {
                return $this->respond(['error' => 'Admin no encontrado'], 404);
            }

            return $admin; 


        } catch (\Throwable $e) {
            return $this->respond(['error' => 'Token inválido: ' . $e->getMessage()], 401);
        }
    }

    public function listarAdministradores()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        try {
            $model = new AdministradorModel();
            $data = $model->findAll();
            return $this->respond(['status' => 'success', 'message' => 'Administradores obtenidos', 'data' => $data], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error obteniendo administradores'], 500);
        }
    }

    public function crearAdministrador()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        $input = $this->request->getJSON(true);
        if (!$input) return $this->respond(['status' => 'error', 'message' => 'Payload inválido'], 400);

        $required = ['dni', 'nombre', 'password', 'categoria'];
        foreach ($required as $f) {
            if (empty($input[$f])) return $this->respond(['status' => 'error', 'message' => "$f es requerido"], 400);
        }

        $model = new AdministradorModel();
        try {
            $data = [
                'dni'      => $input['dni'],
                'nombre'   => $input['nombre'],
                'password' => $input['password'],
                'categoria'=> $input['categoria'],
                'estado'   => isset($input['estado']) ? (int)$input['estado'] : 1
            ];

            $id = $model->createAdministrador($data);
            if ($id === false) {
                $errors = $model->errors();
                return $this->respond(['status' => 'error', 'message' => 'No se pudo crear administrador', 'errors' => $errors], 422);
            }

            $created = $model->find($id);

            // Registrar en historial: acción estática 'crear' y motivo estático
            try {
                $hist = new HistorialAdminModel();
                $performedBy = isset($input['realizado_por']) ? (int)$input['realizado_por'] : (int)$admin['id'];
                $hist->insert([
                    'id_admin'     => (int)$id,
                    'accion'       => 'crear',
                    'motivo'       => 'Nuevo Administrador registrado',
                    'realizado_por'=> $performedBy
                ]);
            } catch (\Throwable $h) {
                log_message('error', 'Historial crear administrador falló: ' . $h->getMessage());
            }

            return $this->respondCreated(['status' => 'success', 'message' => 'Administrador creado', 'data' => $created]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error creando administrador'], 500);
        }
    }

    public function ActualizarAdministrador($id = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (!$id) return $this->respond(['status' => 'error', 'message' => 'ID requerido'], 400);
        $input = $this->request->getJSON(true);
        if (!$input || empty($input['password'])) return $this->respond(['status' => 'error', 'message' => 'password requerido'], 400);

        $model = new \App\Models\AdministradorModel();
        try {
            $newCategoria = $input['categoria'] ?? null;
            $res = $model->updateAdministrador((int)$id, $input['password'], $newCategoria);
            if ($res === false) {
                $errors = $model->errors();
                return $this->respond(['status' => 'error', 'message' => 'No se pudo actualizar administrador', 'errors' => $errors], 422);
            }
            $updated = $model->find($id);

            // Registrar en historial: acción 'actualizar' y motivos estáticos según lo actualizado
            try {
                $hist = new HistorialAdminModel();
                $performedBy = isset($input['realizado_por']) ? (int)$input['realizado_por'] : (int)$admin['id'];

                // Si password fue actualizado (siempre en este endpoint) registrar motivo de contraseña
                $hist->insert([
                    'id_admin'     => (int)$id,
                    'accion'       => 'actualizar',
                    'motivo'       => 'Actualización de contraseña',
                    'realizado_por'=> $performedBy
                ]);

                // Si categoría fue enviada y cambiada, registrar motivo de categoria
                if ($newCategoria !== null) {
                    $hist->insert([
                        'id_admin'     => (int)$id,
                        'accion'       => 'actualizar',
                        'motivo'       => 'Actualizacion de categoria',
                        'realizado_por'=> $performedBy
                    ]);
                }
            } catch (\Throwable $h) {
                log_message('error', 'Historial actualizar administrador falló: ' . $h->getMessage());
            }

            return $this->respond(['status' => 'success', 'message' => 'Administrador actualizado', 'data' => $updated], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error actualizando administrador'], 500);
        }
    }

    public function eliminarAdministrador($id = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (!$id) return $this->respond(['status' => 'error', 'message' => 'ID requerido'], 400);

        $model = new AdministradorModel();
        try {
            $res = $model->eliminarAdministrador((int)$id);
            if ($res === false) return $this->respond(['status' => 'error', 'message' => 'No se pudo eliminar administrador'], 500);

            // Registrar en historial: acción 'eliminar' y motivo estático
            try {
                $hist = new HistorialAdminModel();

                // intentar obtener quien realizó la acción desde body o querystring
                $body = $this->request->getJSON(true) ?: [];

                $performedBy = isset($body['realizado_por']) ? (int) $body['realizado_por'] : (int)$admin['id'];

                $hist->insert([
                    'id_admin'     => (int)$id,
                    'accion'       => 'eliminar',
                    'motivo'       => 'Administrador eliminado',
                    'realizado_por'=> $performedBy
                ]);
            } catch (\Throwable $h) {
                log_message('error', 'Historial eliminar administrador falló: ' . $h->getMessage());
            }

            return $this->respondDeleted(['status' => 'success', 'message' => 'Administrador eliminado']);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error eliminando administrador'], 500);
        }
    }

    public function buscarPorDNI($dni = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (!$dni) return $this->respond(['status' => 'error', 'message' => 'DNI requerido'], 400);
        $model = new AdministradorModel();
        try {
            $item = $model->findByDni($dni);
            if (!$item) return $this->respondNotFound(['status' => 'error', 'message' => 'Administrador no encontrado']);
            return $this->respond(['status' => 'success', 'message' => 'Administrador encontrado', 'data' => $item], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error buscando administrador'], 500);
        }
    }
}