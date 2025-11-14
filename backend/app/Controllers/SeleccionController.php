<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\PreguntaSeleccionadaModel;
use App\Models\HistorialAdminModel;

class SeleccionController extends ResourceController
{
    protected $format = 'json';

    /**
     * seleccionarPregunta
     * Marca una pregunta como seleccionada para un eje seleccionado.
     * Payload JSON: { admin_id, id_eje_seleccionado, id_pregunta }
     */
    public function seleccionarPregunta()
    {
        $input = $this->request->getJSON(true);
        if (!$input) return $this->respond(['status' => 'error', 'message' => 'Payload inválido'], 400);

        $adminId = $input['admin_id'] ?? null;
        $idEjeSel = $input['id_eje_seleccionado'] ?? null;
        $idPregunta = $input['id_pregunta'] ?? null;
        if (!$adminId || !$idEjeSel || !$idPregunta) return $this->respond(['status' => 'error', 'message' => 'admin_id, id_eje_seleccionado, id_pregunta son requeridos'], 400);

        $psModel = new PreguntaSeleccionadaModel();
        $histModel = new HistorialAdminModel();

        try {
            $psModel->insert([
                'id_eje_seleccionado' => $idEjeSel,
                'id_pregunta' => $idPregunta
            ]);

            $histModel->insert([
                'id_admin' => $adminId,
                'accion' => 'crear',
                'motivo' => 'Seleccionó pregunta ' . $idPregunta,
                'realizado_por' => $adminId
            ]);

            return $this->respondCreated(['status' => 'success', 'message' => 'Pregunta seleccionada']);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error seleccionando pregunta'], 500);
        }
    }

    /**
     * preguntasSeleccionadasPorEjeSeleccionado
     * Lista preguntas seleccionadas para un eje seleccionada (id).
     */
    public function preguntasSeleccionadasPorEjeSeleccionado($idEjeSel = null)
    {
        try {
            $model = new PreguntaSeleccionadaModel();
            $items = $model->where('id_eje_seleccionado', $idEjeSel)->findAll();
            return $this->respond(['status' => 'success', 'message' => 'Preguntas seleccionadas', 'data' => $items], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error obteniendo preguntas seleccionadas'], 500);
        }
    }
}