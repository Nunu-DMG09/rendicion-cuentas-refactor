<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UsuarioModel;

class UsuarioController extends ResourceController
{
    protected $format = 'json';

    /**
     * registrarUsuario
     * Registra un usuario/participante.
     * Payload JSON: { nombre, sexo, tipo_participacion, ... }
     */
    public function registrarUsuario()
    {
        $input = $this->request->getJSON(true);
        if (!$input) return $this->respond(['status' => 'error', 'message' => 'Payload inválido'], 400);

        $required = ['nombre', 'sexo', 'tipo_participacion'];
        foreach ($required as $r) {
            if (empty($input[$r])) {
                return $this->respond(['status' => 'error', 'message' => "$r es requerido"], 400);
            }
        }

        $model = new UsuarioModel();
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

            $id = $model->insert($data);
            if ($id === false) {
                // validar errores de validación del modelo
                $errors = $model->errors();
                return $this->respond(['status' => 'error', 'message' => 'Validación fallida', 'errors' => $errors], 422);
            }

            $created = $model->find($id);
            return $this->respondCreated(['status' => 'success', 'message' => 'Usuario registrado', 'data' => $created]);
        } catch (\Throwable $e) {
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
}