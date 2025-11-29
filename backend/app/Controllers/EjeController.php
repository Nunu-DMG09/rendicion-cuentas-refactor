<?php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\EjeModel;

class EjeController extends ResourceController
{
    protected $format = 'json';

    /**
     * listarEjes
     * Devuelve todos los ejes.
     */
    public function listarEjes()
    {
        try {
            $model = new EjeModel();
            $data = $model->findAll();
            $hasData = count($data) > 0;
            return $this->respond([
                'success' => $hasData,
                'message' => $hasData ? 'Ejes encontrados' : 'No se encontraron ejes', 
                'data' => $data
            ]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error obteniendo ejes'], 500);
        }
    }

    /**
     * crearEje
     * Crea un nuevo eje.
     * Payload JSON: { tematica, estado? }
     */
    public function crearEje()
    {
        $input = $this->request->getJSON(true);
        if (!$input || empty($input['tematica'])) {
            return $this->respond(['status' => 'error', 'message' => 'tematica es requerida'], 400);
        }

        $model = new EjeModel();
        try {
           
            if (isset($input['estado'])) {
                if (is_numeric($input['estado'])) {
                    $estado = (int)$input['estado'];
                } elseif (is_string($input['estado'])) {
                    $estadoStr = strtolower(trim($input['estado']));
                    $estado = ($estadoStr === 'habilitado' || $estadoStr === '1' || $estadoStr === 'true') ? 1 : 0;
                } else {
                    $estado = 1;
                }
            } else {
                $estado = 1;
            }

            $dataToInsert = [
                'tematica' => $input['tematica'],
                'estado'   => $estado
            ];

            $insertResult = $model->insert($dataToInsert);

            if ($insertResult === false) {
                $errors  = $model->errors();
                $db     = \Config\Database::connect();
                $dbErr  = $db->error();
                log_message('error', 'Eje::insert failed: ' . json_encode($errors) . ' | DB: ' . json_encode($dbErr));
                return $this->respond(['status' => 'error', 'message' => 'Validación/insert falló', 'errors' => $errors, 'db_error' => $dbErr], 422);
            }

            $insertId = $model->getInsertID() ?: $insertResult;
            if (empty($insertId)) {
                $dbErr = \Config\Database::connect()->error();
                log_message('error', 'Eje::insert returned empty id. DB error: ' . json_encode($dbErr));
                return $this->respond(['status' => 'error', 'message' => 'No se obtuvo id después del insert', 'db_error' => $dbErr], 500);
            }

            $created = $model->find($insertId);
            if (empty($created)) {
                $dbErr = \Config\Database::connect()->error();
                log_message('error', 'Eje insertado pero no recuperable. id: ' . $insertId . ' DB: ' . json_encode($dbErr));
                return $this->respond(['status' => 'error', 'message' => 'Registro creado pero no se pudo recuperar', 'id' => $insertId, 'db_error' => $dbErr], 500);
            }

            return $this->respondCreated(['status' => 'success', 'message' => 'Eje creado', 'data' => $created]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error creando eje'], 500);
        }
    }
}