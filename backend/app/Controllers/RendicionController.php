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
        $input = null;
        try {
            $contentType = $this->request->getHeaderLine('Content-Type') ?? '';
            if (stripos($contentType, 'application/json') !== false || $this->request->is('json')) {
                $input = $this->request->getJSON(true);
            } else {
                $input = $this->request->getPost() ?? [];
            }
        } catch (\Throwable $e) {
            log_message('error', 'Error parsing input en crearRendicion: ' . $e->getMessage());
            return $this->respond(['status'=>'error','message'=>'Payload inválido'], 400);
        }

        if (empty($input)) return $this->respond(['status' => 'error', 'message' => 'Payload inválido'], 400);

        $adminId = $input['admin_id'] ?? null;
        if (!$adminId) return $this->respond(['status' => 'error', 'message' => 'admin_id requerido'], 400);

        $payload = [
            'fecha' => $input['fecha'] ?? date('Y-m-d'),
            'hora'  => $input['hora'] ?? date('H:i:s'),
            'banner'=> $input['banner'] ?? '',
            'motivo' => $input['motivo'] ?? null
        ];

       
        $savedFiles = [];
        try {
            $files = $this->request->getFiles();
            $uploadPath = WRITEPATH . 'uploads/rendicion/';
            if (!is_dir($uploadPath)) mkdir($uploadPath, 0755, true);

            foreach ($files as $key => $fileEntry) {
                if (strpos($key, 'banner') !== 0 && stripos($key, 'banner') === false) {
                    continue;
                }

                $entries = is_array($fileEntry) ? $fileEntry : [$fileEntry];
                foreach ($entries as $file) {
                    if ($file instanceof \CodeIgniter\HTTP\Files\UploadedFile && $file->isValid() && !$file->hasMoved()) {
                        $newName = $file->getRandomName();
                        if ($file->move($uploadPath, $newName)) {
                            $savedFiles[] = $newName;
                        } else {
                            log_message('error', 'Error moviendo archivo banner para admin: ' . $adminId . ' key:' . $key);
                            return $this->respond(['status' => 'error', 'message' => 'Error subiendo banner'], 500);
                        }
                    }
                }
            }

            if (empty($savedFiles)) {
                $file = $this->request->getFile('banner');
                if ($file && $file->isValid() && !$file->hasMoved()) {
                    $newName = $file->getRandomName();
                    if ($file->move($uploadPath, $newName)) {
                        $savedFiles[] = $newName;
                    } else {
                        log_message('error', 'Error moviendo archivo banner (fallback) para admin: ' . $adminId);
                        return $this->respond(['status' => 'error', 'message' => 'Error subiendo banner'], 500);
                    }
                }
            }
        } catch (\Throwable $e) {
            log_message('error', 'Error al procesar archivo banner: ' . $e->getMessage());
            return $this->respond(['status'=>'error','message'=>'Error procesando archivo'], 500);
        }

        if (!empty($savedFiles)) {
            $payload['banner'] = $savedFiles[0];
        }

        $rendModel = new RendicionModel();
        $histModel = new HistorialAdminModel();
        $banerModel = new BanerRendicionModel();

        $db = \Config\Database::connect();
        $db->transStart();
        try {
            $id = $rendModel->insert($payload);
            if ($id === false) {
                $db->transRollback();
                $errors = $rendModel->errors();
                log_message('error', 'Validación Rendicion: ' . json_encode($errors));
                return $this->respond(['status'=>'error','message'=>'Validación fallida','errors'=>$errors], 422);
            }

            $insertId = $rendModel->getInsertID() ?: $id;

            $banerIds = [];
            foreach ($savedFiles as $_fn) {
                $res = $banerModel->insert([
                    'id_rendicion' => $insertId
                ]);
                if ($res === false) {
                    $db->transRollback();
                    $errors = $banerModel->errors();
                    log_message('error', 'Validación BanerRendicion: ' . json_encode($errors));
                    return $this->respond(['status'=>'error','message'=>'Error registrando banner','errors'=>$errors], 422);
                }
                $banerIds[] = $banerModel->getInsertID() ?: $res;
            }

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
                return $this->respond(['status'=>'error','message'=>'Error registrando historial','errors'=>$errors], 422);
            }

            $db->transComplete();
            if ($db->transStatus() === false) throw new \Exception('Transacción fallida');

            $created = $rendModel->find($insertId);
            return $this->respondCreated(['status'=>'success','message'=>'Rendición creada','data'=>$created,'baners_created'=>$banerIds]);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', $e->getMessage());
            return $this->respond(['status'=>'error','message'=>'Error creando rendición','error'=>$e->getMessage()], 500);
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