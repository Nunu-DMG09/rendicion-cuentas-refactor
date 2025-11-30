<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\RendicionModel;
use App\Models\HistorialAdminModel;
use App\Models\EjeSeleccionadoModel;
use App\Models\BanerRendicionModel;

helper('cookie');
helper('jwt');

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

    // Todo esto es para crear una nueva rendición xd

    public function crearRendicion()
    {
        try {
            $jsonData = $this->getJsonData();
            if (!$jsonData) {
                return $this->respond([
                    'status' => 'error',
                    'message' => 'Datos JSON requeridos'
                ], 400);
            }
            $validation = $this->validateRendicionData($jsonData);
            if ($validation !== true) {
                return $this->respond([
                    'status' => 'error',
                    'message' => 'Datos inválidos',
                    'errors' => $validation
                ], 422);
            }
            $loggedAdminId = null;
            $token = get_cookie('access_token') ?: null;
            if ($token) {
                $decoded = verifyJWT($token);
                $loggedAdminId = isset($decoded->data->id) ? (int)$decoded->data->id : null;
            }
            $adminId = $jsonData['admin_id'] ?? 1;
            // $adminId = $jsonData['admin_id'] ?? $loggedAdminId;
            $uploadedFiles = $this->processUploadedFiles();
            $rendicionData = [
                'fecha' => $jsonData['fecha'],
                'hora'  => $jsonData['hora'],
                'admin_id' => $adminId
            ];
            $ejesSeleccionados = $this->processSelectedEjes($jsonData['ejes']);
            return $this->createRendicionTransaction($rendicionData, $ejesSeleccionados, $uploadedFiles);
        } catch (\Throwable $e) {
            log_message('error', 'Error creando rendicion: ' . $e->getMessage());
            return $this->respond([
                'status' => 'error',
                'message' => 'Error interno del servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    private function getJsonData()
    {
        $input = $this->request->getPost("data");
        if (!$input) return null;
        $decoded = json_decode($input, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            log_message('error', 'Error decoding JSON data: ' . json_last_error_msg());
            return null;
        }
        return $decoded;
    }
    private function validateRendicionData($data)
    {
        $errors = [];
        if (empty($data['fecha'])) $errors['fecha'] = 'La fecha es requerida';
        else {
            $fecha = \DateTime::createFromFormat('Y-m-d', $data['fecha']);
            if (!$fecha || $fecha->format('Y-m-d') !== $data['fecha']) {
                $errors['fecha'] = 'Formato de fecha inválido, se espera YYYY-MM-DD';
            } else if ($fecha < new \DateTime('today')) {
                $errors['fecha'] = 'La fecha no puede ser en el pasado';
            }
        }
        if (empty($data['hora'])) $errors['hora'] = 'La hora es requerida';
        else {
            if (!preg_match('/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/', $data['hora'])) {
                $errors['hora'] = 'Formato de hora inválido (HH:MM)';
            }
        }
        if (empty($data['ejes']) || !is_array($data['ejes']) || count($data['ejes']) === 0) {
            $errors['ejes'] = 'Debe seleccionar al menos un eje temático';
        }
        return empty($errors) ? true : $errors;
    }
    private function processUploadedFiles()
    {
        $uploadedFiles = [];
        foreach ($_FILES as $fieldName => $fileData) {
            if (strpos($fieldName, 'banner_') === 0) {
                if (is_uploaded_file($fileData['tmp_name']) && $fileData['error'] === UPLOAD_ERR_OK) {
                    $finfo = finfo_open(FILEINFO_MIME_TYPE);
                    $mimeType = finfo_file($finfo, $fileData['tmp_name']);
                    finfo_close($finfo);
                    if (!in_array($mimeType, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'])) {
                        log_message('error', 'Tipo de archivo no permitido para banner: ' . $mimeType);
                        continue;
                    }
                    if ($fileData['size'] > 5 * 1024 * 1024) {
                        log_message('error', 'Archivo de banner excede tamaño máximo: ' . $fileData['size']);
                        continue;
                    }
                    $uploadedFiles[] = [
                        'tmp_name' => $fileData['tmp_name'],
                        'name'     => $fileData['name'],
                        'type'     => $fileData['type'] ?? null,
                        'size'     => $fileData['size'] ?? 0,
                    ];
                }
            }
        }
        return $uploadedFiles;
    }
    private function processSelectedEjes($ejes)
    {
        $processed = [];
        foreach ($ejes as $ejeId) {
            if (is_numeric($ejeId)) {
                $processed[] = ['id_eje' => (int)$ejeId, 'cantidad_pregunta' => 0];
            }
        }
        return $processed;
    }
    private function createRendicionTransaction($rendicionData, $ejesSeleccionados, $uploadedFiles)
    {
        $rendModel = new RendicionModel();
        $bannerModel = new BanerRendicionModel();
        $ejeSelModel = new EjeSeleccionadoModel();
        $histModel = new HistorialAdminModel();

        $db = \Config\Database::connect();
        $db->transStart();
        try {
            $rendicionId = $rendModel->insert($rendicionData);
            if ($rendicionId === false) throw new \Exception('Error insertando rendición: ' . json_encode($rendModel->errors()));
            $rendicionId = $rendModel->getInsertID();
            $bannersGuardados = $this->saveBanners($rendicionId, $uploadedFiles);
            $ejesAsociados = $this->associateEjes($rendicionId, $ejesSeleccionados);
            $histModel->insert([
                'id_admin' => $rendicionData['admin_id'],
                'accion' => 'crear',
                'motivo' => 'Creó rendición ' . $rendicionId,
                'realizado_por' => $rendicionData['admin_id']
            ]);
            $db->transComplete();
            if ($db->transStatus() === false) throw new \Exception('Transacción fallida');
            $rendicionCreada = $this->getRendicionCompleta($rendicionId);
            return $this->respondCreated([
                'status' => 'success',
                'message' => 'Rendición creada exitosamente',
                'data' => [
                    'id' => $rendicionId,
                    'rendicion' => $rendicionCreada,
                    'banners' => $bannersGuardados,
                    'ejes_asociados' => $ejesAsociados,
                    'total_banners' => count($bannersGuardados),
                    'total_ejes' => count($ejesAsociados)
                ]
            ]);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', $e->getMessage());
            throw $e;
        }
    }
    private function saveBanners($rendicionId, $uploadedFiles)
    {
        $bannersGuardados = [];
        $destFolder = FCPATH . 'uploads/rendicion/' . $rendicionId . '/';
        if (!is_dir($destFolder)) {
            if (!mkdir($destFolder, 0755, true)) {
                throw new \RuntimeException('No se pudo crear carpeta uploads para la rendición ' . $rendicionId);
            }
        }
        $bannerModel = new BanerRendicionModel();
        foreach ($uploadedFiles as $index => $file) {
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $newFileName = 'banner_' . $rendicionId . '_' . ($index + 1) . '_' . uniqid() . ($extension ? '.' . $extension : '');
            $fullPath = $destFolder . $newFileName;
            if (move_uploaded_file($file['tmp_name'], $fullPath)) {
                chmod($fullPath, 0644);
                $relativePath = 'uploads/rendicion/' . $rendicionId . '/' . $newFileName;
                $bannerData = [
                    'id_rendicion' => $rendicionId,
                    'file_path' => $relativePath
                ];
                $bannerId = $bannerModel->insert($bannerData);
                if ($bannerId === false) {
                    log_message('error', 'Error insertando banner en BD: ' . json_encode($bannerModel->errors()));
                    continue;
                }
                $bannersGuardados[] = [
                    'id' => $bannerModel->getInsertID() ?: $bannerId,
                    'file_path' => $relativePath,
                    'original_name' => $file['name'],
                    'file_size' => $file['size'],
                    'url' => base_url($relativePath)
                ];
            } else {
                log_message('error', 'No se pudo mover archivo de banner index ' . ($index + 1));
            }
        }
        return $bannersGuardados;
    }
    private function associateEjes($rendicionId, $ejesSeleccionados)
    {
        $ejeSelModel = new EjeSeleccionadoModel();
        $ejesAsociados = [];
        foreach ($ejesSeleccionados as $eje) {
            $row = [
                'id_rendicion' => $rendicionId,
                'id_eje' => $eje['id_eje'],
                'cantidad_pregunta' => $eje['cantidad_pregunta']
            ];
            $esInsert = $ejeSelModel->insert($row);
            if ($esInsert === false) {
                log_message('error', 'Error asociando eje: ' . json_encode($ejeSelModel->errors()));
                throw new \Exception('Error asociando ejes: ' . json_encode($ejeSelModel->errors()));
            }
            $ejesAsociados[] = [
                'id' => $ejeSelModel->getInsertID(),
                'id_eje' => $eje['id_eje'],
                'cantidad_pregunta' => $eje['cantidad_pregunta']
            ];
        }
        return $ejesAsociados;
    }
    private function getRendicionCompleta($rendicionId)
    {
        $rendModel = new RendicionModel();
        return $rendModel->find($rendicionId);
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
