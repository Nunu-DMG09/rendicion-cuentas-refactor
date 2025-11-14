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
            return $this->respond(['status' => 'success', 'message' => 'Ejes obtenidos', 'data' => $data]);
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
        if (!$input || empty($input['tematica'])) return $this->respond(['status' => 'error', 'message' => 'tematica es requerida'], 400);

        $model = new EjeModel();
        try {
            $id = $model->insert([
                'tematica' => $input['tematica'],
                'estado' => $input['estado'] ?? 'habilitado'
            ]);
            $created = $model->find($id);
            return $this->respondCreated(['status' => 'success', 'message' => 'Eje creado', 'data' => $created]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error creando eje'], 500);
        }
    }
}