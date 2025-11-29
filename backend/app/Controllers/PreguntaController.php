<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\PreguntaModel;

class PreguntaController extends ResourceController
{
    protected $format = 'json';

    /**
     * crearPregunta
     * Crea una pregunta realizada por un usuario.
     * Payload JSON: { contenido, id_usuario, id_eje }
     */
    public function crearPregunta()
    {
        $input = $this->request->getJSON(true);
        if (!$input) return $this->respond(['status' => 'error', 'message' => 'Payload inválido'], 400);

        $required = ['contenido', 'id_usuario', 'id_eje'];
        foreach ($required as $r) if (empty($input[$r])) return $this->respond(['status' => 'error', 'message' => "$r es requerido"], 400);

        $model = new PreguntaModel();
        try {
            $id = $model->insert([
                'contenido' => $input['contenido'],
                'id_usuario' => $input['id_usuario'],
                'id_eje' => $input['id_eje']
            ]);
            $created = $model->find($id);
            return $this->respondCreated(['status' => 'success', 'message' => 'Pregunta creada', 'data' => $created]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error creando pregunta'], 500);
        }
    }

    /**
     * preguntasPorEje
     * Lista preguntas filtradas por eje.
     */
    public function preguntasPorEje($idEje = null)
    {
        try {
            $model = new PreguntaModel();
            $items = $model->where('id_eje', $idEje)->findAll();
            return $this->respond(['status' => 'success', 'message' => 'Preguntas por eje', 'data' => $items]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error obteniendo preguntas'], 500);
        }
    }

  
    public function preguntasPorRendicion($idRend = null)
    {
        try {
            $db = \Config\Database::connect();
            $sql = "SELECT p.* FROM pregunta p
                    JOIN eje e ON e.id = p.id_eje
                    JOIN eje_seleccionado es ON es.id_eje = e.id
                    WHERE es.id_rendicion = ?";
            $results = $db->query($sql, [$idRend])->getResultArray();
            return $this->respond(['status' => 'success', 'message' => 'Preguntas por rendición', 'data' => $results]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error obteniendo preguntas por rendición'], 500);
        }
    }

    public function preguntasPorFechaRendicion($fecha = null)
    {
        if (empty($fecha)) {
            return $this->respond(['status' => 'error', 'message' => 'fecha es requerida. Formato Y-m-d'], 400);
        }

       
        $d = \DateTime::createFromFormat('Y-m-d', $fecha);
        if (!($d && $d->format('Y-m-d') === $fecha)) {
            return $this->respond(['status' => 'error', 'message' => 'Formato de fecha inválido, use Y-m-d'], 400);
        }

        try {
            $model = new PreguntaModel();
            $data = $model->getPreguntasPorFechaRendicion($fecha);
            return $this->respond(['status' => 'success', 'message' => 'Preguntas por fecha de rendición', 'data' => $data], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error obteniendo preguntas por fecha'], 500);
        }
    }
}