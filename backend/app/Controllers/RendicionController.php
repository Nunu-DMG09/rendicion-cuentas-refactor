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
        // Obtener input (JSON o form-data)
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

        if (empty($input)) return $this->respond(['status' => 'error', 'message' => 'Payload inválido'], 400);

        $adminId = $input['admin_id'] ?? null;
        if (!$adminId) return $this->respond(['status' => 'error', 'message' => 'admin_id requerido'], 400);

        // Recolectar todos los archivos subidos (acepta cualquier key)
        $uploadedFiles = [];
        try {
            $files = $this->request->getFiles();
            foreach ($files as $key => $fileEntry) {
                $entries = is_array($fileEntry) ? $fileEntry : [$fileEntry];
                foreach ($entries as $file) {
                    if ($file instanceof \CodeIgniter\HTTP\Files\UploadedFile && $file->isValid() && !$file->hasMoved()) {
                        $uploadedFiles[] = $file;
                    }
                }
            }
            // fallback single if no files found
            if (empty($uploadedFiles)) {
                $single = $this->request->getFile('banner') ?: $this->request->getFile('path');
                if ($single && $single->isValid() && !$single->hasMoved()) $uploadedFiles[] = $single;
            }
        } catch (\Throwable $e) {
            log_message('error', 'Error leyendo archivos en crearRendicion: ' . $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error procesando archivos'], 500);
        }

        // limitar máximo 3 imágenes
        if (count($uploadedFiles) > 3) {
            $uploadedFiles = array_slice($uploadedFiles, 0, 3);
        }

        $rendModel   = new RendicionModel();
        $histModel   = new HistorialAdminModel();
        $db          = \Config\Database::connect();
        $banerTable  = $db->table('baner_rendicion');

        $createdRendiciones = [];
        $createdBaners = [];

        $db->transStart();
        try {
            // Si no hay archivos: crear una rendición única con path vacío (para evitar NOT NULL)
            if (empty($uploadedFiles)) {
                $payload = [
                    'fecha'    => $input['fecha'] ?? date('Y-m-d'),
                    'hora'     => $input['hora'] ?? date('H:i:s'),
                    'admin_id' => $adminId,
                    'path'     => '' // evitar NULL
                ];
                $res = $rendModel->insert($payload);
                if ($res === false) {
                    $db->transRollback();
                    $errors = $rendModel->errors();
                    $dbError = $db->error();
                    log_message('error', 'Insert rendicion falló: ' . json_encode($errors) . ' | DB: ' . json_encode($dbError));
                    return $this->respond(['status' => 'error', 'message' => 'Error creando rendición', 'errors' => $errors, 'db_error' => $dbError], 422);
                }
                $rid = $rendModel->getInsertID() ?: $res;
                $createdRendiciones[] = $rendModel->find($rid);
            } else {
                // Para cada archivo: crear una rendición, crear carpeta por ese id, mover archivo, actualizar path y crear baner_rendicion
                foreach ($uploadedFiles as $file) {
                    // crear rendición inicial (incluye admin_id y motivo)
                    $payload = [
                        'fecha'    => $input['fecha'] ?? date('Y-m-d'),
                        'hora'     => $input['hora'] ?? date('H:i:s'),
                        'admin_id' => $adminId,
                        'path'     => '' // se actualizará luego
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

                    // crear carpeta por rendición
                    $destFolder = FCPATH . 'uploads/rendicion/' . $rendicionId . '/';
                    if (!is_dir($destFolder) && !mkdir($destFolder, 0755, true) && !is_dir($destFolder)) {
                        throw new \RuntimeException('No se pudo crear carpeta uploads para la rendición ' . $rendicionId);
                    }

                    // mover archivo
                    $newName = $file->getRandomName();
                    if (!$file->move($destFolder, $newName)) {
                        $db->transRollback();
                        log_message('error', 'Fallo moviendo archivo a carpeta rendicion ' . $rendicionId);
                        return $this->respond(['status' => 'error', 'message' => 'Error moviendo archivos'], 500);
                    }

                    // ruta relativa empezando con /uploads
                    $relativePath = '/uploads/rendicion/' . $rendicionId . '/' . $newName;

                    // actualizar rendición con path relativo
                    if ($rendModel->update($rendicionId, ['path' => $relativePath]) === false) {
                        $db->transRollback();
                        $errors = $rendModel->errors();
                        log_message('error', 'Error actualizando path rendicion: ' . json_encode($errors));
                        return $this->respond(['status' => 'error', 'message' => 'Error actualizando rendición', 'errors' => $errors], 422);
                    }

                    $createdRendiciones[] = $rendModel->find($rendicionId);

                    // insertar fila en baner_rendicion (una por imagen) con ruta relativa y estado
                    $insertData = [
                        'id_rendicion' => $rendicionId,
                        'file_path'    => $relativePath,
                        'created_at'   => date('Y-m-d H:i:s')
                    ];
                    $banerTable->insert($insertData);
                    $createdBaners[] = $db->insertID();
                }
            }

            // registrar historial (una sola entrada)
            $histInsert = $histModel->insert([
                'id_admin' => $adminId,
                'accion' => 'crear',
                'motivo' => $input['motivo'] ?? null,
                'realizado_por' => $adminId
            ]);
            if ($histInsert === false) {
                $db->transRollback();
                $errors = $histModel->errors();
                log_message('error', 'Validación Historial: ' . json_encode($errors));
                return $this->respond(['status' => 'error', 'message' => 'Error registrando historial', 'errors' => $errors], 422);
            }

            $db->transComplete();
            if ($db->transStatus() === false) throw new \Exception('Transacción fallida');

            return $this->respondCreated([
                'status' => 'success',
                'message' => 'Rendiciones creadas',
                'rendiciones' => $createdRendiciones,
                'baners' => $createdBaners
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