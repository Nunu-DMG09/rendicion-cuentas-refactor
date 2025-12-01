<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\EjeModel;

class EjeController extends ResourceController
{
    protected $format = 'json';


    /*=============================
        LISTAR EJES 
    =============================*/

    public function listarEjes()
    {
        try {
            $model = new EjeModel();
            $data = $model->findAll();
            $hasData = count($data) > 0;

            return $this->respond([
                'success' => $hasData,
                'message' => $hasData ? 'Ejes encontrados' : 'No se encontraron ejes',
                'data'    => $data
            ], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond([
                'success' => false,
                'message' => 'Error obteniendo ejes',
                'data'    => []
            ], 500);
        }
    }

    /*============================
    CREAR EJE
    ===========================*/

    public function crearEje()
    {
        $input = $this->request->getJSON(true);
        if (!$input || empty($input['tematica'])) {
            return $this->respond([
                'success' => false,
                'message' => 'tematica es requerida',
                'data'    => []
            ], 400);
        }

        $model = new EjeModel();
        try {
            
            $dataToInsert = [
                'tematica' => $input['tematica']
            ];

            $insertResult = $model->insert($dataToInsert);

            if ($insertResult === false) {
                $errors = $model->errors();
                $dbErr  = \Config\Database::connect()->error();
                log_message('error', 'Eje::insert failed: ' . json_encode($errors) . ' | DB: ' . json_encode($dbErr));
                return $this->respond([
                    'success' => false,
                    'message' => 'Validación/insert falló',
                    'data'    => ['errors' => $errors, 'db_error' => $dbErr]
                ], 422);
            }

            $insertId = $model->getInsertID() ?: $insertResult;
            if (empty($insertId)) {
                $dbErr = \Config\Database::connect()->error();
                log_message('error', 'Eje::insert returned empty id. DB error: ' . json_encode($dbErr));
                return $this->respond([
                    'success' => false,
                    'message' => 'No se obtuvo id después del insert',
                    'data'    => ['db_error' => $dbErr]
                ], 500);
            }

            $created = $model->find($insertId) ?: [];
            return $this->respondCreated([
                'success' => true,
                'message' => 'Eje creado',
                'data'    => $created
            ]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond([
                'success' => false,
                'message' => 'Error creando eje',
                'data'    => []
            ], 500);
        }
    }

    /*===============================
    EDITAR ESTADO DEL EJE (HABILITAR/DESHABILITAR)
    ===============================*/

    public function toggleEjeEstado($id)
    {
        $model = new EjeModel();
        try {
            $eje = $model->find($id);
            if (!$eje) {
                return $this->respond([
                    'success' => false,
                    'message' => 'Eje no encontrado',
                    'data'    => []
                ], 404);
            }

            $newEstado = ($eje['estado'] === "1" || $eje['estado'] === 1) ? 0 : 1;
            $updated = $model->update($id, ['estado' => $newEstado]);

            if ($updated === false) {
                $dbErr = \Config\Database::connect()->error();
                log_message('error', 'Eje::update failed for id '.$id.' DB: '.json_encode($dbErr));
                return $this->respond([
                    'success' => false,
                    'message' => 'No se pudo actualizar estado',
                    'data'    => ['db_error' => $dbErr]
                ], 500);
            }

            $updatedEje = $model->find($id) ?: [];
            return $this->respond([
                'success' => true,
                'message' => 'Estado del eje actualizado',
                'data'    => $updatedEje
            ], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond([
                'success' => false,
                'message' => 'Error actualizando estado del eje',
                'data'    => []
            ], 500);
        }
    }
}
