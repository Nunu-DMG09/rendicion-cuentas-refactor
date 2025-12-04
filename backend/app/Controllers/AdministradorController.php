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
            return $this->respond(['success' => false, 'message' => 'No autenticado', 'data' => []], 401);
        }

        try {
            $decoded = verifyJWT($token);

            if (!isset($decoded->data->dni)) {
                return $this->respond(['success' => false, 'message' => 'Token inválido', 'data' => []], 401);
            }

            $adminModel = new \App\Models\AdministradorModel();
            $admin = $adminModel->where('dni', $decoded->data->dni)->first();

            if (!$admin) {
                return $this->respond(['success' => false, 'message' => 'Admin no encontrado', 'data' => []], 404);
            }

            return $admin;
        } catch (\Throwable $e) {
            return $this->respond(['success' => false, 'message' => 'Token inválido: ' . $e->getMessage(), 'data' => []], 401);
        }
    }

    public function listarAdministradores()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        try {
            $model = new AdministradorModel();
            $data = $model->findAll();
            $has = !empty($data);
            return $this->respond(['success' => $has, 'message' => $has ? 'Administradores obtenidos' : 'No se encontraron administradores', 'data' => $has ? $data : []], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error obteniendo administradores', 'data' => []], 500);
        }
    }

    public function crearAdministrador()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        $input = $this->request->getJSON(true);
        if (!$input) return $this->respond(['success' => false, 'message' => 'Payload inválido', 'data' => []], 400);

        $required = ['dni', 'nombre', 'password', 'categoria'];
        foreach ($required as $f) {
            if (empty($input[$f])) return $this->respond(['success' => false, 'message' => "$f es requerido", 'data' => []], 400);
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
                return $this->respond(['success' => false, 'message' => 'No se pudo crear administrador', 'data' => $errors], 422);
            }

            $created = $model->find($id);

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

            return $this->respondCreated(['success' => true, 'message' => 'Administrador creado', 'data' => $created]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error creando administrador', 'data' => []], 500);
        }
    }

    public function ActualizarAdministrador($id = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (!$id) return $this->respond(['success' => false, 'message' => 'ID requerido', 'data' => []], 400);
        $input = $this->request->getJSON(true);
        if (!$input || empty($input['password'])) return $this->respond(['success' => false, 'message' => 'password requerido', 'data' => []], 400);

        $model = new \App\Models\AdministradorModel();
        try {
            $newCategoria = $input['categoria'] ?? null;
            $res = $model->updateAdministrador((int)$id, $input['password'], $newCategoria);
            if ($res === false) {
                $errors = $model->errors();
                return $this->respond(['success' => false, 'message' => 'No se pudo actualizar administrador', 'data' => $errors], 422);
            }
            $updated = $model->find($id);

            try {
                $hist = new HistorialAdminModel();
                $performedBy = isset($input['realizado_por']) ? (int)$input['realizado_por'] : (int)$admin['id'];

                $hist->insert([
                    'id_admin'     => (int)$id,
                    'accion'       => 'actualizar',
                    'motivo'       => 'Actualización de contraseña',
                    'realizado_por'=> $performedBy
                ]);

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

            return $this->respond(['success' => true, 'message' => 'Administrador actualizado', 'data' => $updated], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error actualizando administrador', 'data' => []], 500);
        }
    }

    public function eliminarAdministrador($id = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (!$id) return $this->respond(['success' => false, 'message' => 'ID requerido', 'data' => []], 400);

        $model = new AdministradorModel();
        try {
            $res = $model->eliminarAdministrador((int)$id);
            if ($res === false) return $this->respond(['success' => false, 'message' => 'No se pudo eliminar administrador', 'data' => []], 500);

            try {
                $hist = new HistorialAdminModel();
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

            return $this->respondDeleted(['success' => true, 'message' => 'Administrador eliminado', 'data' => []]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error eliminando administrador', 'data' => []], 500);
        }
    }

    public function buscarPorDNI($dni = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (!$dni) return $this->respond(['success' => false, 'message' => 'DNI requerido', 'data' => []], 400);
        $model = new AdministradorModel();
        try {
            $item = $model->findByDni($dni);
            if (!$item) return $this->respondNotFound(['success' => false, 'message' => 'Administrador no encontrado', 'data' => []]);
            return $this->respond(['success' => true, 'message' => 'Administrador encontrado', 'data' => $item], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error buscando administrador', 'data' => []], 500);
        }
    }

    /**
     * DashboardStatistics
     * Llama al modelo para obtener las estadísticas y responde con success/data.
     */
    public function DashboardStatistics()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        try {
            $model = new \App\Models\AdministradorModel();
            $estadisticas = $model->getDashboardStatistics((int) ($admin['id'] ?? 0));

            $has = !empty($estadisticas);
            return $this->respond([
                'success' => $has,
                'message' => $has ? 'Estadísticas obtenidas' : 'No se pudieron obtener estadísticas',
                'data'    => $has ? $estadisticas : []
            ], 200);
        } catch (\Throwable $e) {
            log_message('error', 'DashboardStatistics controller error: ' . $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error obteniendo estadísticas', 'data' => []], 500);
        }
    }

    /*=======================================================================
    LISTAR RENDICIONES CON FILTRO DE BÚSQUEDA ?query=2026
     =================================================*/
    public function rendicionesList()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        try {
            $query = $this->request->getGet('query');
            $model = new \App\Models\AdministradorModel();
            $result = $model->getRendicionesList($query ?? null);

            return $this->respond(['success' => true, 'message' => 'Rendiciones listadas', 'data' => $result], 200);
        } catch (\Throwable $e) {
            log_message('error', 'AdministradorController::rendicionesList error: ' . $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error listando rendiciones', 'data' => []], 500);
        }
    }
    
    /**
     * GET /admin-preguntas/{id}
     * Devuelve todas las preguntas por eje para la rendición {id} con is_selected y orden_seleccion.
     */
    public function preguntasConSeleccion($id = null)
    {
        $id = (int)$id;
        if ($id <= 0) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'ID de rendición inválido',
                'data' => []
            ]);
        }

        try {
            $model = new \App\Models\AdministradorModel();
            $data = $model->getPreguntasConSeleccionPorRendicion($id);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Preguntas (seleccionadas y no seleccionadas) por eje para la rendición',
                'data' => $data
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'AdministradorController::preguntasConSeleccion error: ' . $e->getMessage());
            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Error al obtener preguntas',
                'data' => []
            ]);
        }
    }

    /*======================================
    PARA SELECCIONAR / DESELECCIONAR PREGUNTAS
    ======================================*/

    public function seleccionarPreguntas()
    {
        $input = $this->request->getJSON(true);
        if (!is_array($input)) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Payload inválido',
                'data' => []
            ]);
        }

        $ids = $input['pregunta_ids'] ?? null;
        $action = isset($input['action']) ? strtolower(trim($input['action'])) : null;
        $idEjeSel = isset($input['id_eje_seleccionado']) ? (int)$input['id_eje_seleccionado'] : null;
        $adminId = isset($input['admin_id']) ? (int)$input['admin_id'] : null;

        if (!is_array($ids) || empty($ids)) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Se requieren pregunta_ids como arreglo no vacío',
                'data' => []
            ]);
        }

        if (!in_array($action, ['select', 'unselect'], true)) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Action inválida. Debe ser "select" o "unselect"',
                'data' => []
            ]);
        }

        if (!$idEjeSel || $idEjeSel <= 0) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Se requiere id_eje_seleccionado válido',
                'data' => []
            ]);
        }

        $db = \Config\Database::connect();
        $table = $db->table('pregunta_seleccionada');
        $histModel = new \App\Models\HistorialAdminModel();

        try {
            $db->transStart();

            $processed = 0;
            $processedIds = [];

            if ($action === 'select') {
                foreach ($ids as $pid) {
                    $pid = (int)$pid;
                    if ($pid <= 0) continue;

                    $exists = (int)$db->table('pregunta_seleccionada')
                        ->where('id_eje_seleccionado', $idEjeSel)
                        ->where('id_pregunta', $pid)
                        ->countAllResults();

                    if ($exists === 0) {
                        $table->insert([
                            'id_eje_seleccionado' => $idEjeSel,
                            'id_pregunta' => $pid,
                            'created_at' => date('Y-m-d H:i:s')
                        ]);

                        if ($db->affectedRows() > 0) {
                            $processed++;
                            $processedIds[] = $pid;
                        }
                    }
                }
            } else { 
                $table->where('id_eje_seleccionado', $idEjeSel)
                      ->whereIn('id_pregunta', array_map('intval', $ids))
                      ->delete();

                $processed = $db->affectedRows();
                $processedIds = array_map('intval', $ids);
            }

            if ($adminId) {
                $histModel->insert([
                    'id_admin' => $adminId,
                    'accion' => $action === 'select' ? 'seleccionar' : 'deseleccionar',
                    'motivo' => ($action === 'select' ? 'Seleccionó preguntas: ' : 'Deseleccionó preguntas: ') . implode(',', $processedIds),
                    'realizado_por' => $adminId,
                    'created_at' => date('Y-m-d H:i:s')
                ]);
            }

            $db->transComplete();

            if ($db->transStatus() === false) {
                throw new \RuntimeException('Error en transacción de selección/deselección');
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => $action === 'select' ? 'Preguntas seleccionadas correctamente' : 'Preguntas deseleccionadas correctamente',
                'data' => [
                    'action' => $action,
                    'id_eje_seleccionado' => $idEjeSel,
                    'processed_count' => $processed,
                    'pregunta_ids' => $processedIds
                ]
            ]);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', 'AdministradorController::seleccionarPreguntas error: ' . $e->getMessage());
            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Error al procesar selección/deselección',
                'data' => []
            ]);
        }
    }
}