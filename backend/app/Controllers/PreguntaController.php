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
        if (!$input) {
            return $this->respond(['success' => false, 'message' => 'Payload inválido', 'data' => []], 400);
        }

        $required = ['contenido', 'id_usuario', 'id_eje'];
        foreach ($required as $r) {
            if (empty($input[$r])) {
                return $this->respond(['success' => false, 'message' => "$r es requerido", 'data' => []], 400);
            }
        }

        $model = new PreguntaModel();
        try {
            $id = $model->insert([
                'contenido' => $input['contenido'],
                'id_usuario' => $input['id_usuario'],
                'id_eje' => $input['id_eje']
            ]);
            $created = $model->find($id);
            $success = !empty($created);
            return $this->respondCreated(['success' => $success, 'message' => $success ? 'Pregunta creada' : 'No creada', 'data' => $success ? $created : []]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error creando pregunta', 'data' => []], 500);
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
            $has = !empty($items);
            return $this->respond(['success' => $has, 'message' => $has ? 'Preguntas por eje' : 'No se encontraron preguntas', 'data' => $has ? $items : []], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error obteniendo preguntas', 'data' => []], 500);
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
            $has = !empty($results);
            return $this->respond(['success' => $has, 'message' => $has ? 'Preguntas por rendición' : 'No se encontraron preguntas para la rendición', 'data' => $has ? $results : []], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error obteniendo preguntas por rendición', 'data' => []], 500);
        }
    }

    public function preguntasPorFechaRendicion($fecha = null)
    {
        if (empty($fecha)) {
            return $this->respond(['success' => false, 'message' => 'fecha es requerida. Formato Y-m-d', 'data' => []], 400);
        }

        $d = \DateTime::createFromFormat('Y-m-d', $fecha);
        if (!($d && $d->format('Y-m-d') === $fecha)) {
            return $this->respond(['success' => false, 'message' => 'Formato de fecha inválido, use Y-m-d', 'data' => []], 400);
        }

        try {
            $model = new PreguntaModel();
            $preguntas = $model->getPreguntasPorFechaRendicion($fecha);

            $db = \Config\Database::connect();
            $rendRows = $db->table('rendicion')->select('id')->where('fecha', $fecha)->get()->getResultArray();
            $rendIds = array_column($rendRows, 'id');

            $usuarios = [];
            if (!empty($rendIds)) {
                $usuarios = $db->table('usuario')->whereIn('id_rendicion', $rendIds)->get()->getResultArray();
            }

            $has = !empty($preguntas) || !empty($usuarios);
            return $this->respond([
                'success' => $has,
                'message' => $has ? 'Preguntas y usuarios por fecha de rendición' : 'No se encontraron preguntas ni usuarios para la fecha',
                'data' => [
                    'preguntas' => $preguntas ?: [],
                    'usuarios'  => $usuarios  ?: []
                ]
            ], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error obteniendo preguntas por fecha', 'data' => []], 500);
        }
    }
}