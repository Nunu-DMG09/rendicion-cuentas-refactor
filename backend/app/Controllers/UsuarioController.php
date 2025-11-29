<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UsuarioModel;
use App\Models\PreguntaModel;

class UsuarioController extends ResourceController
{
    protected $format = 'json';

    /*=======================================
    REGISTRAR USUARIOS
    =======================================*/
    public function registrarUsuario()
    {
        $input = $this->request->getJSON(true);
        if (!$input) return $this->respond(['status' => 'error', 'message' => 'Payload inválido'], 400);

        // Validaciones básicas siempre requeridas
        $required = ['nombre', 'sexo', 'tipo_participacion'];
        foreach ($required as $r) {
            if (empty($input[$r])) {
                return $this->respond(['status' => 'error', 'message' => "$r es requerido"], 400);
            }
        }

        // Si es orador, exigir campos adicionales
        $isOrador = (isset($input['tipo_participacion']) && $input['tipo_participacion'] === 'orador');
        if ($isOrador) {
            if (empty($input['titulo'])) {
                return $this->respond(['status' => 'error', 'message' => 'titulo es requerido para orador'], 400);
            }
            if (empty($input['id_eje'])) {
                return $this->respond(['status' => 'error', 'message' => 'id_eje (eje tematico) es requerido para orador'], 400);
            }
            if (empty($input['pregunta'])) {
                return $this->respond(['status' => 'error', 'message' => 'pregunta es requerida para orador'], 400);
            }
        }

        $userModel = new UsuarioModel();
        $pregModel = new PreguntaModel();
        $db = \Config\Database::connect();

        $db->transStart();
        try {
            $data = [
                'nombre' => $input['nombre'],
                'sexo' => $input['sexo'],
                'tipo_participacion' => $input['tipo_participacion'],
                'titulo' => $input['titulo'] ?? null,
                'ruc_empresa' => $input['ruc_empresa'] ?? null,
                'nombre_empresa' => $input['nombre_empresa'] ?? null,
                'dni' => $input['dni'] ?? null,
                'id_rendicion' => isset($input['id_rendicion']) ? (int)$input['id_rendicion'] : null,
                'asistencia' => $input['asistencia'] ?? 'no'
            ];

            $userId = $userModel->insert($data);
            if ($userId === false) {
                $db->transRollback();
                $errors = $userModel->errors();
                return $this->respond(['status' => 'error', 'message' => 'Validación usuario falló', 'errors' => $errors], 422);
            }

            $createdUser = $userModel->find($userId);

            // Si es orador, crear pregunta y asociarla al usuario y eje
            $createdQuestion = null;
            if ($isOrador) {
                $pregData = [
                    'contenido' => $input['pregunta'],
                    'id_usuario' => (int)$userId,
                    'id_eje' => (int)$input['id_eje']
                ];
                $pregId = $pregModel->insert($pregData);
                if ($pregId === false) {
                    $db->transRollback();
                    $errors = $pregModel->errors();
                    return $this->respond(['status' => 'error', 'message' => 'Error guardando pregunta', 'errors' => $errors], 422);
                }
                $createdQuestion = $pregModel->find($pregId);
            }

            $db->transComplete();
            if ($db->transStatus() === false) {
                return $this->respond(['status' => 'error', 'message' => 'Transacción fallida'], 500);
            }

            $response = ['status' => 'success', 'message' => 'Usuario registrado', 'data' => $createdUser];
            if ($createdQuestion) $response['pregunta'] = $createdQuestion;

            return $this->respondCreated($response);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error registrando usuario'], 500);
        }
    }

    /**
     * marcarAsistencia
     * Actualiza el campo asistencia de un usuario.
     * Payload JSON: { asistencia: 'si'|'no' }
     */
    public function marcarAsistencia($id = null)
    {
        $input = $this->request->getJSON(true);
        if (!$input || !isset($input['asistencia'])) return $this->respond(['status' => 'error', 'message' => 'asistencia es requerido'], 400);

        $model = new UsuarioModel();
        try {
            $user = $model->find($id);
            if (!$user) return $this->respondNotFound(['status' => 'error', 'message' => 'Usuario no encontrado']);
            $model->update($id, ['asistencia' => $input['asistencia']]);
            $updated = $model->find($id);
            return $this->respond(['status' => 'success', 'message' => 'Asistencia actualizada', 'data' => $updated]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error actualizando asistencia'], 500);
        }
    }

    /**
     * usuariosPorRendicion
     * Obtiene usuarios vinculados a una rendición.
     */
    public function usuariosPorRendicion($idRend = null)
    {
        try {
            $model = new UsuarioModel();
            $users = $model->where('id_rendicion', $idRend)->findAll();
            return $this->respond(['status' => 'success', 'message' => 'Usuarios obtenidos', 'data' => $users]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error obteniendo usuarios'], 500);
        }
    }

    /*=======================================
    LISTAR A LOS USUARIOS QUE SON ASISTENTES
    =======================================*/
    public function listarAsistentes()
    {
        try {
            $model = new UsuarioModel();
            $data = $model->getAsistentes();
            return $this->respond(['status' => 'success', 'message' => 'Asistentes obtenidos', 'data' => $data], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error obteniendo asistentes'], 500);
        }
    }

    /*=======================================
    LISTAR A LOS USUARIOS QUE SON ORADORES
    =======================================*/
    public function listarOradores()
    {
        try {
            $model = new UsuarioModel();
            $data = $model->getOradores();
            return $this->respond(['status' => 'success', 'message' => 'Oradores obtenidos', 'data' => $data], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error obteniendo oradores'], 500);
        }
    }

    /**
     * Asignar uno o varios usuarios a una rendición.
     * Payload JSON: { "id_rendicion": 5, "user_ids": [10,11,12] }
     */
    public function asignarARendicion()
    {
        $input = $this->request->getJSON(true);
        if (!$input || !isset($input['id_rendicion']) || empty($input['user_ids'])) {
            return $this->respond(['status' => 'error', 'message' => 'id_rendicion y user_ids son requeridos'], 400);
        }

        $idRend = (int)$input['id_rendicion'];
        $userIds = is_array($input['user_ids']) ? array_map('intval', $input['user_ids']) : [(int)$input['user_ids']];

        $db = \Config\Database::connect();
        $db->transStart();
        try {
            $builder = $db->table('usuario');
            $builder->whereIn('id', $userIds)->update(['id_rendicion' => $idRend]);

            $db->transComplete();
            if ($db->transStatus() === false) {
                return $this->respond(['status' => 'error', 'message' => 'Transacción fallida'], 500);
            }

            return $this->respond(['status' => 'success', 'message' => 'Usuarios asignados a rendición', 'id_rendicion' => $idRend, 'user_ids' => $userIds], 200);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', 'Error asignando usuarios: ' . $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error asignando usuarios'], 500);
        }
    }
}