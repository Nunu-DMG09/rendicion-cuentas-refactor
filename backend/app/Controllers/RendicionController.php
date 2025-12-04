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
            $hasData = !empty($data);

            return $this->respond([
                'success' => $hasData,
                'message' => $hasData ? 'Rendiciones obtenidas' : 'No se encontraron rendiciones',
                'data'    => $hasData ? $data : []
            ], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond([
                'success' => false,
                'message' => 'Error obteniendo rendiciones',
                'data'    => []
            ], 500);
        }
    }

    // Listar rendiciones más actuales:
    // - Si existe query param ?year=YYYY devuelve hasta 2 rendiciones de ese año (ordenadas por fecha desc)
    // - Si no hay año, devuelve la rendición más reciente
    public function recientes()
    {
        try {
            $year = $this->request->getGet('year');
            $rendModel = new RendicionModel();

            if ($year && is_numeric($year)) {
                $y = (int) $year;
                $rendiciones = $rendModel
                    ->where("YEAR(fecha) = {$y}", null, false)
                    ->orderBy('fecha', 'DESC')
                    ->findAll(2);
            } else {
                $rendiciones = $rendModel
                    ->orderBy('fecha', 'DESC')
                    ->findAll(1);
            }

            if (empty($rendiciones)) {
                return $this->respond([
                    'success' => false,
                    'message' => 'No se encontraron rendiciones',
                    'count' => 0,
                    'data' => []
                ], 200);
            }

            $rendicionesFormateadas = [];
            foreach ($rendiciones as $r) {
                $rendicionesFormateadas[] = $this->formatRendicionItem($r);
            }
            return $this->respond([
                'success' => true,
                'message' => 'Rendiciones obtenidas',
                'count'   => count($rendiciones),
                'data'    => $rendicionesFormateadas
            ], 200);
        } catch (\Throwable $e) {
            log_message('error', 'Error obteniendo rendiciones recientes: ' . $e->getMessage());
            return $this->respond([
                'success' => false,
                'message' => 'Error interno al obtener rendiciones',
                'data'    => []
            ], 500);
        }
    }
    private function getRendicionStats($rendicionId)
    {
        try {
            $userModel = new \App\Models\UsuarioModel();
            $preguntaModel = new \App\Models\PreguntaModel();
            $preguntaSelModel = new \App\Models\PreguntaSeleccionadaModel();
            $usuarios = $userModel->where('id_rendicion', $rendicionId)->findAll() ?: [];
            $totalInscritos = count($usuarios);
            $asistentes = $userModel->where('id_rendicion', $rendicionId)->where('asistencia', 'si')->countAllResults();
            $noAsistentes = $totalInscritos - $asistentes;
            $totalPreguntas = $preguntaModel->where('id_rendicion', $rendicionId)->countAllResults();
            // TODO: Esto no esta bien, se debe hacer joins para contar solo las preguntas seleccionadas para la rendición y hacer calculos
            $preguntasRespondidas = $preguntaModel->where('id_rendicion', $rendicionId)->where('estado', 'respondida')->countAllResults();
            $preguntasPendientes = $totalPreguntas - $preguntasRespondidas;
            return [
                'total_inscritos' => $totalInscritos,
                'asistentes' => $asistentes,
                'no_asistentes' => $noAsistentes,
                'total_preguntas' => $totalPreguntas,
                'preguntas_respondidas' => $preguntasRespondidas,
                'preguntas_pendientes' => $preguntasPendientes
            ];
        } catch (\Throwable $e) {
            log_message('error', 'Error obteniendo stats de rendición ' . $rendicionId . ': ' . $e->getMessage());
            return [
                'total_inscritos' => 0,
                'asistentes' => 0,
                'no_asistentes' => 0,
                'total_preguntas' => 0,
                'preguntas_respondidas' => 0,
                'preguntas_pendientes' => 0
            ];
        }
    }
    private function determineRendicionStatus($fecha, $hora)
    {
        $fechaHora = new \DateTime($fecha . ' ' . $hora);
        $now = new \DateTime();

        if ($fechaHora > $now) return 'programada';
        elseif ($fechaHora <= $now && $fechaHora->diff($now)->h < 3) {
            // Si es el mismo día y han pasado menos de 3 horas, está en curso
            return 'en_curso';
        } else return 'finalizada';
    }
    private function formatRendicionItem($rendicion)
    {
        $bannerModel = new BanerRendicionModel();
        $ejeSelModel = new EjeSeleccionadoModel();

        $banners = $bannerModel->where('id_rendicion', $rendicion['id'])->findAll() ?: [];
        $bannersFormateados = array_map(function ($b) {
            return [
                'id' => (int)$b['id'],
                'name' => basename($b['file_path']),
                'url' => base_url($b['file_path'])
            ];
        }, $banners);

        $ejesAsociados = $ejeSelModel->getEjesConNombreByRendicion($rendicion['id']);
        $ejesTematicos = array_map(function ($eje) {
            return [
                'id' => (int)$eje['id_eje'],
                'nombre' => $eje['tematica'],
                'cantidad_pregunta' => (int)$eje['cantidad_pregunta']
            ];
        }, $ejesAsociados);
        $stats = $this->getRendicionStats($rendicion['id']);
        $status = $this->determineRendicionStatus($rendicion['fecha'], $rendicion['hora']);
        return [
            'id' => (string)$rendicion['id'],
            'fecha' => $rendicion['fecha'],
            'hora'  => $rendicion['hora'],
            'banners' => $bannersFormateados,
            'ejesTematicos' => $ejesTematicos,
            'status' => $status,
            'asistentesRegistrados' => $stats['total_inscritos'],
            'preguntasRecibidas' => $stats['total_preguntas'],
            'year' => (int)date('Y', strtotime($rendicion['fecha'])),
            'detalles' => [
                'totalInscritos' => $stats['total_inscritos'],
                'asistentes' => $stats['asistentes'],
                'noAsistentes' => $stats['no_asistentes'],
                'totalPreguntas' => $stats['total_preguntas'],
                'preguntasRespondidas' => $stats['preguntas_respondidas'],
                'preguntasPendientes' => $stats['preguntas_pendientes'],
                'lugar' => "Auditorio Municipal"
            ]
        ];
    }

    public function obtenerRendicion($id = null)
    {
        try {
            $model = new RendicionModel();
            $item = $model->find($id);
            if (!$item) {
                return $this->respond([
                    'success' => false,
                    'message' => 'Rendición no encontrada',
                    'data'    => []
                ], 404);
            }
            return $this->respond([
                'success' => true,
                'message' => 'Rendición encontrada',
                'data'    => $item
            ], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond([
                'success' => false,
                'message' => 'Error obteniendo rendición',
                'data'    => []
            ], 500);
        }
    }

    // Todo esto es para crear una nueva rendición xd

    public function crearRendicion()
    {
        try {
            $jsonData = $this->getJsonData();
            if (!$jsonData) {
                return $this->respond([
                    'success' => false,
                    'message' => 'Datos JSON requeridos',
                    'data'    => []
                ], 400);
            }
            $validation = $this->validateRendicionData($jsonData);
            if ($validation !== true) {
                return $this->respond([
                    'success' => false,
                    'message' => 'Datos inválidos',
                    'data'    => $validation
                ], 422);
            }
            $loggedAdminId = null;
            $token = get_cookie('access_token') ?: null;
            if ($token) {
                $decoded = verifyJWT($token);
                $loggedAdminId = isset($decoded->data->id) ? (int)$decoded->data->id : null;
            }
            $adminId = $jsonData['admin_id'] ?? 1;
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
                'success' => false,
                'message' => 'Error interno del servidor',
                'data'    => []
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
            // Acepta "HH:MM" o "HH:MM:SS"
            if (!preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/', $data['hora'])) {
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
                'success' => true,
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
            return $this->respond([
                'success' => false,
                'message' => 'Error interno al crear rendición',
                'data'    => []
            ], 500);
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
        if (!$input) return $this->respond([
            'success' => false,
            'message' => 'Payload inválido',
            'data'    => []
        ], 400);

        $adminId = $input['admin_id'] ?? null;
        $idRend  = $input['id_rendicion'] ?? null;
        $ejes    = $input['ejes'] ?? null;
        if (!$adminId || !$idRend || !is_array($ejes)) return $this->respond([
            'success' => false,
            'message' => 'admin_id, id_rendicion y ejes son requeridos',
            'data'    => []
        ], 400);

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

            $hasData = !empty($inserted);
            return $this->respond([
                'success' => $hasData,
                'message' => $hasData ? 'Ejes asociados' : 'No se asociaron ejes',
                'data'    => $hasData ? $inserted : []
            ], 201);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', $e->getMessage());
            return $this->respond([
                'success' => false,
                'message' => 'Error asociando ejes',
                'data'    => []
            ], 500);
        }
    }

    /**
     * Listar participantes de una rendición con sus preguntas y ejes
     */
    public function participantes($id = null)
    {
        if (empty($id) || !is_numeric($id)) {
            return $this->respond([
                'success' => false,
                'message' => 'id rendicion inválido',
                'data'    => []
            ], 400);
        }

        try {
            $userModel = new \App\Models\UsuarioModel();
            $data = $userModel->getUsuariosPorRendicionConPreguntas((int)$id);
            $hasData = !empty($data);

            return $this->respond([
                'success' => $hasData,
                'message' => $hasData ? 'Participantes obtenidos' : 'No se encontraron participantes',
                'data'    => $hasData ? $data : []
            ], 200);
        } catch (\Throwable $e) {
            log_message('error', 'Error obteniendo participantes: ' . $e->getMessage());
            return $this->respond([
                'success' => false,
                'message' => 'Error obteniendo participantes',
                'data'    => []
            ], 500);
        }
    }

    /*======================
    EDITAR RENDICION
    ======================*/

    public function editarRendicion($id = null)
    {
        if (empty($id) || !is_numeric($id)) {
            return $this->respond(['success' => false, 'message' => 'id rendicion inválido', 'data' => []], 400);
        }

        $rendModel = new RendicionModel();
        $rend = $rendModel->find((int) $id);
        if (!$rend) {
            return $this->respond(['success' => false, 'message' => 'Rendición no encontrada', 'data' => []], 404);
        }

        $input = $this->request->getPost('data');
        $json = $input ? json_decode($input, true) : null;

        $update = [];
        $hasChange = false;

        if ($json) {
            if (array_key_exists('fecha', $json)) {
                $fecha = $json['fecha'];
                $dt = \DateTime::createFromFormat('Y-m-d', $fecha);
                if (!$dt || $dt->format('Y-m-d') !== $fecha) {
                    return $this->respond(['success' => false, 'message' => 'fecha inválida, formato YYYY-MM-DD', 'data' => []], 422);
                }
                $update['fecha'] = $fecha;
                $hasChange = true;
            }
            if (array_key_exists('hora', $json)) {
                $hora = $json['hora'];
                // Acepta "HH:MM" o "HH:MM:SS"
                if (!preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/', $hora)) {
                    return $this->respond(['success' => false, 'message' => 'hora inválida, formato HH:MM o HH:MM:SS', 'data' => []], 422);
                }
                // Normalizar a HH:MM:SS si viene como HH:MM
                if (preg_match('/^[0-2]\d:[0-5]\d$/', $hora)) {
                    $hora = $hora . ':00';
                }
                $update['hora'] = $hora;
                $hasChange = true;
            }
        }

        // Check uploaded banners
        $uploadedFiles = $this->processUploadedFiles();
        if (!empty($uploadedFiles)) $hasChange = true;

        if (!$hasChange) {
            return $this->respond(['success' => false, 'message' => 'Nada para actualizar', 'data' => []], 400);
        }

        $db = \Config\Database::connect();
        $db->transStart();
        try {
            // update fecha/hora if provided
            if (!empty($update)) {
                $res = $rendModel->update($id, $update);
                if ($res === false) {
                    throw new \RuntimeException('Error actualizando rendición: ' . json_encode($rendModel->errors()));
                }
            }

            $bannerModel = new BanerRendicionModel();
            $bannersSaved = $bannerModel->where('id_rendicion', $id)->findAll() ?: [];

            if (!empty($uploadedFiles)) {
                // delete existing files and DB rows
                foreach ($bannersSaved as $b) {
                    if (!empty($b['file_path'])) {
                        $fp = FCPATH . $b['file_path'];
                        if (is_file($fp)) @unlink($fp);
                    }
                }
                $bannerModel->where('id_rendicion', $id)->delete();

                $bannersSaved = $this->saveBanners($id, $uploadedFiles);
            } else {
                $bannersSaved = $bannerModel->where('id_rendicion', $id)->findAll() ?: [];
            }

            $db->transComplete();
            if ($db->transStatus() === false) {
                throw new \RuntimeException('Transacción fallida');
            }

            $rendicionActualizada = $rendModel->find($id);
            return $this->respond([
                'success' => true,
                'message' => 'Rendición actualizada',
                'data'    => [
                    'rendicion' => $rendicionActualizada,
                    'banners'   => $bannersSaved
                ]
            ], 200);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', 'Error editando rendición: ' . $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error actualizando rendición', 'data' => []], 500);
        }
    }

    /*=======================================================================
     * BANNERS
     * Obtiene los banners de la rendición más reciente
     =======================================================================*/
    public function banners()
    {
        try {
            $model = new \App\Models\RendicionModel();
            $data = $model->getBannersRendicionActual();
            $has = !empty($data);

            return $this->respond([
                'success' => $has,
                'message' => $has ? 'Banners obtenidos' : 'No se encontraron banners',
                'data' => $has ? $data : []
            ], 200);
        } catch (\Throwable $e) {
            log_message('error', 'RendicionController::banners error: ' . $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error obteniendo banners', 'data' => []], 500);
        }
    }

    /*=======================================================================
     * Datos Registro
     * Obtiene datos de la rendición actual para el formulario de registro
     =======================================================================*/
    public function datosRegistro()
    {
        try {
            $model = new \App\Models\RendicionModel();
            $data = $model->getDatosRendicionParaRegistro();
            $has = !empty($data);

            return $this->respond([
                'success' => $has,
                'message' => $has ? 'Datos de registro obtenidos' : 'No hay rendición disponible para registro',
                'data' => $has ? $data : []
            ], 200);
        } catch (\Throwable $e) {
            log_message('error', 'RendicionController::datosRegistro error: ' . $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error obteniendo datos de registro', 'data' => []], 500);
        }
    }

    /*=======================================================================
    rendiciones
    Obtiene las rendiciones del año actual con sus estadísticas (para home)
     =======================================================================*/
    public function rendiciones()
    {
        try {
            $model = new \App\Models\RendicionModel();
            $data = $model->getRendicionesAnoActualConPreguntas();
            $has = !empty($data);

            return $this->respond([
                'success' => $has,
                'message' => $has ? 'Rendiciones obtenidas' : 'No se encontraron rendiciones',
                'data' => $has ? $data : []
            ], 200);
        } catch (\Throwable $e) {
            log_message('error', 'RendicionController::rendiciones error: ' . $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error obteniendo rendiciones', 'data' => []], 500);
        }
    }

    /*=======================================================================
     OBTENER PREGUNTAS SELECCIONADAS CON SU EJE POR ID DE LA RENDICION
     ==============================================================*/
    public function preguntasSeleccionadas($id = null)
    {
        if (empty($id) || !is_numeric($id)) {
            return $this->respond(['success' => false, 'message' => 'id rendicion inválido', 'data' => []], 400);
        }

        $rendModel = new \App\Models\RendicionModel();
        $rend = $rendModel->find((int)$id);
        if (!$rend) {
            return $this->respond(['success' => false, 'message' => 'Rendición no encontrada', 'data' => []], 404);
        }

        $data = $rendModel->getPreguntasSeleccionadasPorRendicion((int)$id);

        return $this->respond([
            'success' => true,
            'message' => 'Preguntas seleccionadas obtenidas',
            'data' => $data
        ], 200);
    }
}
