<?php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\RendicionModel;
use App\Models\HistorialAdminModel;
use App\Models\EjeSeleccionadoModel;
use App\Models\BanerRendicionModel;

class RendicionController extends ResourceController
{
    protected $format = 'json';

    // Listar todas las rendiciones
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

    public function crearRendicion()
    {
       
        $input = [];
        try {
            $contentType = $this->request->getHeaderLine('Content-Type') ?? '';
            if (stripos($contentType, 'application/json') !== false || $this->request->is('json')) {
                $input = $this->request->getJSON(true) ?? [];
            } else {
                $input = $this->request->getPost() ?? [];
            }
        } catch (\Throwable $e) {
            log_message('error', 'Error parsing input en crearRendicion: ' . $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Payload inválido'], 400);
        }

        helper('cookie'); helper('jwt');
        $loggedAdminId = null;
        try {
            $token = get_cookie('access_token') ?: null;
            if ($token) {
                $decoded = verifyJWT($token);
                $loggedAdminId = isset($decoded->data->id) ? (int)$decoded->data->id : null;
            }
        } catch (\Throwable $e) {
            log_message('debug', 'No se pudo obtener admin desde token: ' . $e->getMessage());
        }

        $adminId = $input['admin_id'] ?? $loggedAdminId;
        if (!$adminId) return $this->respond(['status' => 'error', 'message' => 'admin_id requerido'], 400);

        
        $uploadedFiles = [];
        $normalize = function ($filesArray) {
            $out = [];
            foreach ($filesArray as $field => $file) {
                if (!isset($file['name'])) continue;
                if (is_array($file['name'])) {
                    $count = count($file['name']);
                    for ($i = 0; $i < $count; $i++) {
                        if (isset($file['error'][$i]) && $file['error'][$i] === UPLOAD_ERR_OK && !empty($file['tmp_name'][$i])) {
                            $out[] = [
                                'tmp_name' => $file['tmp_name'][$i],
                                'name'     => $file['name'][$i],
                                'type'     => $file['type'][$i] ?? null,
                                'size'     => $file['size'][$i] ?? 0,
                            ];
                        }
                    }
                } else {
                    if (isset($file['error']) && $file['error'] === UPLOAD_ERR_OK && !empty($file['tmp_name'])) {
                        $out[] = [
                            'tmp_name' => $file['tmp_name'],
                            'name'     => $file['name'],
                            'type'     => $file['type'] ?? null,
                            'size'     => $file['size'] ?? 0,
                        ];
                    }
                }
            }
            return $out;
        };

       
        $uploadedFiles = $normalize($_FILES);
      
        $uploadedFiles = array_slice($uploadedFiles, 0, 10);
      

        $rendicionData = [
            'fecha' => $input['fecha'] ?? date('Y-m-d'),
            'hora'  => $input['hora'] ?? date('H:i:s'),
            'admin_id' => $adminId
        ];

       
        $ejesSeleccionados = [];
        if (!empty($input['ejes'])) {
            $ejesRaw = $input['ejes'];
            if (is_string($ejesRaw)) {
                $decoded = json_decode($ejesRaw, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $ejesRaw = $decoded;
                } else {
                    $parts = array_filter(array_map('trim', explode(',', trim($ejesRaw, "[] \t\n\r\0\x0B"))));
                    $ejesRaw = array_map(function ($v) { return ['id_eje' => (int)$v, 'cantidad_pregunta' => 0]; }, $parts);
                }
            }
            if (is_array($ejesRaw)) {
                foreach ($ejesRaw as $eje) {
                    if (is_array($eje) && isset($eje['id_eje'])) {
                        $ejesSeleccionados[] = [
                            'id_eje' => (int)$eje['id_eje'],
                            'cantidad_pregunta' => isset($eje['cantidad_pregunta']) ? (int)$eje['cantidad_pregunta'] : 0
                        ];
                    } elseif (is_numeric($eje)) {
                        $ejesSeleccionados[] = ['id_eje' => (int)$eje, 'cantidad_pregunta' => 0];
                    }
                }
            }
        } elseif (!empty($input['id_eje'])) {
            $ids = $input['id_eje'];
            if (is_string($ids)) {
                $ids = trim($ids);
                $decoded = json_decode($ids, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $ids = $decoded;
                } else {
                    $ids = array_filter(array_map('trim', explode(',', trim($ids, "[] \t\n\r\0\x0B"))));
                }
            }
            if (is_array($ids)) {
                foreach ($ids as $id) $ejesSeleccionados[] = ['id_eje' => (int)$id, 'cantidad_pregunta' => 0];
            }
        }

        $rendModel = new RendicionModel();
        $banerModel = new BanerRendicionModel();
        $ejeSelModel = new EjeSeleccionadoModel();
        $histModel = new HistorialAdminModel();

        $db = \Config\Database::connect();
        $db->transStart();
        try {
            $insertResult = $rendModel->insert($rendicionData);
            if ($insertResult === false) {
                $errors = $rendModel->errors();
                $db->transRollback();
                return $this->respond(['status' => 'error', 'message' => 'Error creando rendición', 'errors' => $errors], 422);
            }
            $rendicionId = $rendModel->getInsertID() ?: $insertResult;

            $bannersGuardados = [];
            $failedFiles = [];
            if (!empty($uploadedFiles)) {
                $destFolder = FCPATH . 'uploads/rendicion/' . $rendicionId . '/';
                if (!is_dir($destFolder) && !mkdir($destFolder, 0755, true) && !is_dir($destFolder)) {
                    throw new \RuntimeException('No se pudo crear carpeta uploads para la rendición ' . $rendicionId);
                }

                foreach ($uploadedFiles as $index => $file) {
                    $originalName = $file['name'] ?? 'upload';
                    $ext = pathinfo($originalName, PATHINFO_EXTENSION);
                    $newName = 'banner_' . $rendicionId . '_' . ($index + 1) . '_' . uniqid() . ($ext ? '.' . $ext : '');
                    $tmp = $file['tmp_name'];

                    $moved = false;
                  
                    if (is_uploaded_file($tmp) && @move_uploaded_file($tmp, $destFolder . $newName)) {
                        $moved = true;
                    } else {
                       
                        if (!empty($tmp) && file_exists($tmp)) {
                            if (@rename($tmp, $destFolder . $newName) || @copy($tmp, $destFolder . $newName)) {
                                $moved = true;
                            }
                        }
                    }

                    if ($moved) {
                        @chmod($destFolder . $newName, 0644);
                        $relativePath = 'uploads/rendicion/' . $rendicionId . '/' . $newName;
                        $bannerData = ['id_rendicion' => $rendicionId, 'file_path' => $relativePath];
                        $banInsert = $banerModel->insert($bannerData);
                        if ($banInsert === false) {
                            $failedFiles[] = ['index' => $index + 1, 'name' => $originalName, 'error' => $banerModel->errors()];
                            log_message('error', 'Error insertando baner en BD: ' . json_encode($banerModel->errors()));
                        } else {
                            $bannerId = $banerModel->getInsertID() ?: $banInsert;
                            $bannersGuardados[] = ['id' => $bannerId, 'file_path' => $relativePath, 'original_name' => $originalName, 'index' => $index + 1];
                        }
                    } else {
                        $failedFiles[] = ['index' => $index + 1, 'name' => $originalName, 'reason' => 'no se pudo mover archivo'];
                        log_message('error', 'No se pudo mover archivo index ' . ($index + 1) . ' tmp: ' . ($tmp ?? 'n/a'));
                    }
                }
            }

           
            $ejesAsociados = [];
            foreach ($ejesSeleccionados as $eje) {
                $row = ['id_rendicion' => $rendicionId, 'id_eje' => $eje['id_eje'], 'cantidad_pregunta' => $eje['cantidad_pregunta']];
                $esInsert = $ejeSelModel->insert($row);
                if ($esInsert === false) {
                    log_message('error', 'Error asociando eje: ' . json_encode($ejeSelModel->errors()));
                    $db->transRollback();
                    return $this->respond(['status' => 'error', 'message' => 'Error asociando ejes', 'errors' => $ejeSelModel->errors()], 422);
                }
                $ejesAsociados[] = array_merge($row, ['id' => $ejeSelModel->getInsertID() ?: $esInsert]);
            }

         
            $histModel->insert(['id_admin' => $adminId, 'accion' => 'crear', 'motivo' => 'Creó rendición ' . $rendicionId, 'realizado_por' => $adminId]);

            $db->transComplete();
            if ($db->transStatus() === false) throw new \Exception('Transacción fallida');

            $rendicionCreada = $rendModel->find($rendicionId);

            $response = ['status' => 'success', 'message' => 'Rendición creada exitosamente', 'data' => ['rendicion' => $rendicionCreada, 'banners' => $bannersGuardados, 'ejes_asociados' => $ejesAsociados]];
            if (!empty($failedFiles)) $response['warnings'] = ['failed_files' => $failedFiles];

            return $this->respondCreated($response);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', 'Error en crearRendicion: ' . $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error creando rendición', 'error' => $e->getMessage()], 500);
        }
    }
    

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

    /**
     * Listar participantes de una rendición con sus preguntas y ejes
     */
    public function participantes($id = null)
    {
        if (empty($id) || !is_numeric($id)) {
            return $this->respond(['status' => 'error', 'message' => 'id rendicion inválido'], 400);
        }

        try {
            $userModel = new \App\Models\UsuarioModel();
            $data = $userModel->getUsuariosPorRendicionConPreguntas((int)$id);

            return $this->respond(['status' => 'success', 'message' => 'Participantes obtenidos', 'data' => $data], 200);
        } catch (\Throwable $e) {
            log_message('error', 'Error obteniendo participantes: ' . $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error obteniendo participantes'], 500);
        }
    }
}