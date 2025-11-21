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
        // Obtener input (form-data principalmente)
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

        // permitir crear rendición sin datos de input si solo se suben archivos
        if (empty($input)) {
            $input = []; // continuar con array vacío
        }

        // obtener admin logeado desde cookie JWT; si no, usar admin_id del payload
        helper('cookie');
        helper('jwt');
        $loggedAdminId = null;
        try {
            $token = get_cookie('access_token') ?: null;
            if ($token) {
                $decoded = verifyJWT($token);
                $loggedAdminId = isset($decoded->data->id) ? (int)$decoded->data->id : null;
            }
        } catch (\Throwable $e) {
            log_message('debug', 'No se pudo obtener admin logeado desde token: ' . $e->getMessage());
        }

        $adminId = $input['admin_id'] ?? $loggedAdminId;
        if (!$adminId) return $this->respond(['status' => 'error', 'message' => 'admin_id requerido (o iniciar sesión)'], 400);

        // recolectar archivos subidos (form-data)
        $uploadedFiles = [];
        try {
            $files = $this->request->getFiles();
            foreach ($files as $key => $fileEntry) {
                if (is_array($fileEntry)) {
                    // múltiples archivos con la misma key (ej: banner[])
                    foreach ($fileEntry as $file) {
                        if ($file instanceof \CodeIgniter\HTTP\Files\UploadedFile && $file->isValid() && !$file->hasMoved()) {
                            $uploadedFiles[] = $file;
                        }
                    }
                } else {
                    // archivo único
                    if ($fileEntry instanceof \CodeIgniter\HTTP\Files\UploadedFile && $fileEntry->isValid() && !$fileEntry->hasMoved()) {
                        $uploadedFiles[] = $fileEntry;
                    }
                }
            }
        } catch (\Throwable $e) {
            log_message('error', 'Error leyendo archivos en crearRendicion: ' . $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error procesando archivos'], 500);
        }

        // limitar máximo 3 archivos
        if (count($uploadedFiles) > 3) {
            $uploadedFiles = array_slice($uploadedFiles, 0, 3);
        }

        $rendModel  = new RendicionModel();
        $db         = \Config\Database::connect();
        $banerTable = $db->table('baner_rendicion');

        $createdRendiciones = [];
        $createdBaners = [];

        $db->transStart();
        try {
            // crear rendición (sin campo path - eliminado)
            $payload = [
                'fecha'    => $input['fecha'] ?? date('Y-m-d'),
                'hora'     => $input['hora'] ?? date('H:i:s'),
                'admin_id' => $adminId,
            ];

            $insertResult = $rendModel->insert($payload);
            if ($insertResult === false) {
                $db->transRollback();
                $errors = $rendModel->errors();
                $dbError = $db->error();
                log_message('error', 'Insert rendicion falló: ' . json_encode($errors) . ' | DB: ' . json_encode($dbError));
                return $this->respond(['status' => 'error', 'message' => 'Error creando rendición', 'errors' => $errors, 'db_error' => $dbError], 422);
            }
            $rendicionId = $rendModel->getInsertID() ?: $insertResult;

            // mover cada archivo y crear fila propia en baner_rendicion
            if (!empty($uploadedFiles)) {
                // crear carpeta física: C:\xampp\htdocs\...\public\uploads\rendicion\{ID}
                $destFolder = FCPATH . 'uploads/rendicion/' . $rendicionId . '/';
                if (!is_dir($destFolder) && !mkdir($destFolder, 0755, true) && !is_dir($destFolder)) {
                    throw new \RuntimeException('No se pudo crear carpeta uploads para la rendición ' . $rendicionId);
                }

                foreach ($uploadedFiles as $index => $file) {
                    $newName = $file->getRandomName();
                    $fullPath = $destFolder . $newName;
                    
                    if (!$file->move($destFolder, $newName)) {
                        $db->transRollback();
                        log_message('error', 'Fallo moviendo archivo ' . ($index + 1) . ' a carpeta rendicion ' . $rendicionId);
                        return $this->respond(['status' => 'error', 'message' => 'Error moviendo archivo ' . ($index + 1)], 500);
                    }

                    // ruta completa para almacenar en BD según tu ejemplo
                    $fullStoragePath = 'C:\\xampp\\htdocs\\repositorios-github\\rendicion-cuentas-refactor\\backend\\public\\uploads\\rendicion\\' . $rendicionId . '\\' . $newName;

                    // insertar UNA fila por cada archivo subido
                    $insertData = [
                        'id_rendicion' => $rendicionId,
                        'file_path'    => $fullStoragePath,
                        'created_at'   => date('Y-m-d H:i:s')
                    ];
                    
                    $insertBanerResult = $banerTable->insert($insertData);
                    if ($insertBanerResult) {
                        $createdBaners[] = $db->insertID();
                        log_message('info', 'Archivo ' . ($index + 1) . ' guardado: ' . $fullStoragePath);
                    } else {
                        log_message('error', 'Error insertando baner_rendicion para archivo ' . ($index + 1));
                    }
                }
            }

            $createdRendiciones[] = $rendModel->find($rendicionId);

            $db->transComplete();
            if ($db->transStatus() === false) throw new \Exception('Transacción fallida');

            return $this->respondCreated([
                'status' => 'success',
                'message' => 'Rendición creada con ' . count($uploadedFiles) . ' archivo(s)',
                'rendicion_id' => $rendicionId,
                'rendiciones' => $createdRendiciones,
                'baners_created' => count($createdBaners),
                'baner_ids' => $createdBaners
            ]);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', $e->getMessage());
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
}