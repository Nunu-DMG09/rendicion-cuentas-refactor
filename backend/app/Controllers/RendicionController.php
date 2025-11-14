<?php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\RendicionModel;
use App\Models\HistorialAdminModel;
use App\Models\EjeSeleccionadoModel;

class RendicionController extends ResourceController
{
    protected $format = 'json';

    /**
     * listarRendiciones
     * Devuelve todas las rendiciones.
     */
    public function listarRendiciones()
    {
        try {
            $model = new RendicionModel();
            $data = $model->findAll();
            return $this->respond(['status' => 'success', 'message' => 'Rendiciones obtenidas', 'data' => $data], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error obteniendo rendiciones'], 500);
        }
    }

    /**
     * obtenerRendicion
     * Retorna una rendición por id.
     */
    public function obtenerRendicion($id = null)
    {
        try {
            $model = new RendicionModel();
            $item = $model->find($id);
            if (!$item) return $this->respondNotFound(['status' => 'error', 'message' => 'Rendición no encontrada']);
            return $this->respond(['status' => 'success', 'message' => 'Rendición encontrada', 'data' => $item], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error obteniendo rendición'], 500);
        }
    }

    /**
     * crearRendicion
     * Crea una rendición y registra la acción en historial.
     * Acepta JSON o form-data (campo file: banner).
     * form-data keys: admin_id (text), fecha (text), hora (text), banner (file), motivo (text)
     */
    public function crearRendicion()
    {
        // Detectar tipo de contenido y obtener input de forma segura
        $contentType = $this->request->getHeaderLine('Content-Type') ?? '';
        $input = [];

        if (stripos($contentType, 'application/json') !== false || $this->request->is('json')) {
            try {
                $input = $this->request->getJSON(true);
            } catch (\Throwable $e) {
                log_message('error', 'JSON parse error en crearRendicion: ' . $e->getMessage());
                return $this->respond(['status' => 'error', 'message' => 'JSON inválido'], 400);
            }
        } else {
            // form-data / x-www-form-urlencoded
            $input = $this->request->getPost() ?? [];
        }

        if (!$input) return $this->respond(['status' => 'error', 'message' => 'Payload inválido'], 400);

        $adminId = $input['admin_id'] ?? null;
        if (!$adminId) return $this->respond(['status' => 'error', 'message' => 'admin_id requerido'], 400);

        $payload = [
            'fecha' => $input['fecha'] ?? date('Y-m-d'),
            'hora'  => $input['hora'] ?? date('H:i:s'),
            'banner'=> $input['banner'] ?? ''
        ];

        // Manejo de archivo si viene por form-data
        try {
            $file = $this->request->getFile('banner');
            if ($file && $file->isValid() && !$file->hasMoved()) {
                $uploadPath = WRITEPATH . 'uploads/';
                if (!is_dir($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }
                $newName = $file->getRandomName();
                if ($file->move($uploadPath, $newName)) {
                    $payload['banner'] = $newName;
                } else {
                    log_message('error', 'Error moviendo archivo banner para admin: ' . $adminId);
                    return $this->respond(['status' => 'error', 'message' => 'Error subiendo banner'], 500);
                }
            }
        } catch (\Throwable $e) {
            log_message('error', 'Error al procesar archivo banner: ' . $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error procesando archivo'], 500);
        }

        $rendModel = new RendicionModel();
        $histModel = new HistorialAdminModel();

        $db = \Config\Database::connect();
        $db->transStart();
        try {
            $id = $rendModel->insert($payload);
            if (!$id) throw new \Exception('No se insertó rendición');

            $histModel->insert([
                'id_admin' => $adminId,
                'accion' => 'crear',
                'motivo' => $input['motivo'] ?? null,
                'realizado_por' => $adminId
            ]);

            $db->transComplete();
            if ($db->transStatus() === false) throw new \Exception('Transacción fallida');

            $created = $rendModel->find($id);
            return $this->respondCreated(['status' => 'success', 'message' => 'Rendición creada', 'data' => $created]);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error creando rendición', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * asociarEjes
     * Asocia múltiples ejes a una rendición en una transacción.
     * Payload JSON: { admin_id, id_rendicion, ejes: [{ id_eje, cantidad_pregunta }, ...] }
     */
    public function asociarEjes()
    {
        $input = $this->request->getJSON(true);
        if (!$input) return $this->respond(['status' => 'error', 'message' => 'Payload inválido'], 400);

        $adminId = $input['admin_id'] ?? null;
        $idRend  = $input['id_rendicion'] ?? null;
        $ejes    = $input['ejes'] ?? null;
        if (!$adminId || !$idRend || !is_array($ejes)) return $this->respond(['status' => 'error', 'message' => 'admin_id, id_rendicion y ejes son requeridos'], 400);

        $esModel = new EjeSeleccionadoModel();
        $histModel = new HistorialAdminModel();
        $db = \Config\Database::connect();
        $db->transStart();
        try {
            $inserted = [];
            foreach ($ejes as $e) {
                $row = [
                    'id_rendicion' => $idRend,
                    'id_eje' => $e['id_eje'],
                    'cantidad_pregunta' => $e['cantidad_pregunta'] ?? 0
                ];
                $esModel->insert($row);
                $inserted[] = $row;
            }

            $histModel->insert([
                'id_admin' => $adminId,
                'accion' => 'crear',
                'motivo' => 'Asociación de ejes a rendición: ' . $idRend,
                'realizado_por' => $adminId
            ]);

            $db->transComplete();
            if ($db->transStatus() === false) throw new \Exception('Transacción fallida al asociar ejes');

            return $this->respond(['status' => 'success', 'message' => 'Ejes asociados', 'data' => $inserted], 201);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error asociando ejes', 'error' => $e->getMessage()], 500);
        }
    }
}