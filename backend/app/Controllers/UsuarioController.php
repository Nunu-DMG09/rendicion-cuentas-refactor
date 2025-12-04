<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UsuarioModel;
use App\Models\PreguntaModel;
use App\Models\RendicionModel;

class UsuarioController extends ResourceController
{
    protected $format = 'json';

    /*=======================================
    REGISTRAR USUARIOS
    =======================================*/
    public function registrarUsuario($idRendicionRoute = null)
    {
        $input = $this->request->getJSON(true);
        if (!$input) {
            return $this->respond(['success' => false, 'message' => 'Payload inválido', 'data' => []], 400);
        }

        $required = ['nombre', 'sexo', 'tipo_participacion'];
        foreach ($required as $r) {
            if (empty($input[$r])) {
                return $this->respond(['success' => false, 'message' => "$r es requerido", 'data' => []], 400);
            }
        }

        $isOrador = (isset($input['tipo_participacion']) && $input['tipo_participacion'] === 'orador');
        if ($isOrador) {
            if (empty($input['titulo'])) {
                return $this->respond(['success' => false, 'message' => 'titulo es requerido para orador', 'data' => []], 400);
            }
            $questionContent = $input['pregunta'] ?? $input['contenido'] ?? null;
            if (empty($questionContent)) {
                return $this->respond(['success' => false, 'message' => 'pregunta (o contenido) es requerida para orador', 'data' => []], 400);
            }
        }

        $userModel = new UsuarioModel();
        $pregModel = new PreguntaModel();
        $rendModel = new RendicionModel();
        $db = \Config\Database::connect();

        $idRendicion = null;
        if (!empty($idRendicionRoute)) {
            $idRendicion = (int)$idRendicionRoute;
        } elseif (!empty($input['id_rendicion'])) {
            $idRendicion = (int)$input['id_rendicion'];
        }

        if (!empty($idRendicion)) {
            $rend = $rendModel->find($idRendicion);
            if (!$rend) {
                return $this->respond(['success' => false, 'message' => 'Rendición no encontrada', 'data' => []], 404);
            }

            $rendFecha = $rend['fecha'] ?? null;
            $rendHora = $rend['hora'] ?? '00:00:00';
            if ($rendFecha) {
                $rendDatetime = strtotime($rendFecha . ' ' . $rendHora);
                $now = time();
                if ($rendDatetime <= $now) {
                    return $this->respond(['success' => false, 'message' => 'No se puede registrar: la rendición ya pasó', 'data' => []], 400);
                }
            }
        }

        $db->transStart();
        try {
            if (empty($idRendicion)) {
                $ultima = $rendModel->orderBy('fecha', 'DESC')->orderBy('hora', 'DESC')->first();
                if (!empty($ultima) && isset($ultima['id'])) {
                    $idRendicion = (int)$ultima['id'];
                } else {
                    $idRendicion = null;
                }
            }

            if (!empty($idRendicion)) {
                $rend = $rendModel->find($idRendicion);
                if (!$rend) {
                    $db->transRollback();
                    return $this->respond(['success' => false, 'message' => 'Rendición no encontrada (después de asignar última)', 'data' => []], 404);
                }
                $rendFecha = $rend['fecha'] ?? null;
                $rendHora = $rend['hora'] ?? '00:00:00';
                if ($rendFecha) {
                    $rendDatetime = strtotime($rendFecha . ' ' . $rendHora);
                    if ($rendDatetime <= time()) {
                        $db->transRollback();
                        return $this->respond(['success' => false, 'message' => 'No se puede registrar: la rendición seleccionada ya pasó', 'data' => []], 400);
                    }
                }
            }

            if (!empty($idRendicion)) {
                if (!empty($input['dni'])) {
                    $existsDni = $db->table('usuario')
                        ->where('id_rendicion', $idRendicion)
                        ->where('dni', $input['dni'])
                        ->get()
                        ->getRowArray();
                    if (!empty($existsDni)) {
                        $db->transRollback();
                        return $this->respond([
                            'success' => false,
                            'message' => 'Ya existe un usuario con ese DNI registrado para esta rendición',
                            'data' => $existsDni
                        ], 409);
                    }
                }

                $providedUserId = null;
                foreach (['user_id', 'id_usuario', 'id'] as $k) {
                    if (!empty($input[$k])) { $providedUserId = (int)$input[$k]; break; }
                }
                if (!empty($providedUserId)) {
                    $existsId = $db->table('usuario')
                        ->where('id_rendicion', $idRendicion)
                        ->where('id', $providedUserId)
                        ->get()
                        ->getRowArray();
                    if (!empty($existsId)) {
                        $db->transRollback();
                        return $this->respond([
                            'success' => false,
                            'message' => 'El usuario indicado ya está registrado para esta rendición',
                            'data' => $existsId
                        ], 409);
                    }
                }
            }

            $data = [
                'nombre' => $input['nombre'],
                'sexo' => $input['sexo'],
                'tipo_participacion' => $input['tipo_participacion'],
                'titulo' => $input['titulo'] ?? null,
                'ruc_empresa' => $input['ruc_empresa'] ?? null,
                'nombre_empresa' => $input['nombre_empresa'] ?? null,
                'dni' => $input['dni'] ?? null,
                'id_rendicion' => $idRendicion,
                'asistencia' => $input['asistencia'] ?? 'no'
            ];

            $userId = $userModel->insert($data);
            if ($userId === false) {
                $db->transRollback();
                $errors = $userModel->errors();
                return $this->respond(['success' => false, 'message' => 'Validación usuario falló', 'data' => $errors], 422);
            }

            $createdUser = $userModel->find($userId);

            $createdQuestion = null;
            if ($isOrador) {
                $pregData = [
                    'contenido'  => $input['pregunta'] ?? $input['contenido'] ?? '',
                    'id_usuario' => (int)$userId,
                    'id_eje'     => isset($input['id_eje']) && $input['id_eje'] !== '' ? (int)$input['id_eje'] : null
                ];

                $pregId = $pregModel->insert($pregData);
                if ($pregId === false) {
                    $db->transRollback();
                    $errors = $pregModel->errors();
                    return $this->respond(['success' => false, 'message' => 'Error guardando pregunta', 'data' => $errors], 422);
                }
                $createdQuestion = $pregModel->find($pregId);
            }

            $db->transComplete();
            if ($db->transStatus() === false) {
                return $this->respond(['success' => false, 'message' => 'Transacción fallida', 'data' => []], 500);
            }

            $responseData = $createdUser ?: [];
            if ($createdQuestion) $responseData['pregunta'] = $createdQuestion;

            return $this->respondCreated(['success' => true, 'message' => 'Usuario registrado', 'data' => $responseData]);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error registrando usuario', 'data' => []], 500);
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
        if (!$input || !isset($input['asistencia'])) {
            return $this->respond(['success' => false, 'message' => 'asistencia es requerido', 'data' => []], 400);
        }

        $model = new UsuarioModel();
        try {
            $user = $model->find($id);
            if (!$user) return $this->respond(['success' => false, 'message' => 'Usuario no encontrado', 'data' => []], 404);
            $model->update($id, ['asistencia' => $input['asistencia']]);
            $updated = $model->find($id);
            return $this->respond(['success' => true, 'message' => 'Asistencia actualizada', 'data' => $updated], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error actualizando asistencia', 'data' => []], 500);
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
            $has = !empty($users);
            return $this->respond(['success' => $has, 'message' => $has ? 'Usuarios obtenidos' : 'No se encontraron usuarios', 'data' => $has ? $users : []], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error obteniendo usuarios', 'data' => []], 500);
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
            $has = !empty($data);
            return $this->respond(['success' => $has, 'message' => $has ? 'Asistentes obtenidos' : 'No se encontraron asistentes', 'data' => $has ? $data : []], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error obteniendo asistentes', 'data' => []], 500);
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
            $has = !empty($data);
            return $this->respond(['success' => $has, 'message' => $has ? 'Oradores obtenidos' : 'No se encontraron oradores', 'data' => $has ? $data : []], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error obteniendo oradores', 'data' => []], 500);
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
            return $this->respond(['success' => false, 'message' => 'id_rendicion y user_ids son requeridos', 'data' => []], 400);
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
                return $this->respond(['success' => false, 'message' => 'Transacción fallida', 'data' => []], 500);
            }

            return $this->respond(['success' => true, 'message' => 'Usuarios asignados a rendición', 'data' => ['id_rendicion' => $idRend, 'user_ids' => $userIds]], 200);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', 'Error asignando usuarios: ' . $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error asignando usuarios', 'data' => []], 500);
        }
    }

    /**
     * usuariosPorFechaRendicion
     * Obtiene todos los usuarios vinculados a las rendiciones de una fecha (Y-m-d),
     * incluyendo sus preguntas y datos del eje.
     */
    public function usuariosPorFechaRendicion($fecha = null)
    {
        if (empty($fecha)) {
            return $this->respond(['success' => false, 'message' => 'fecha es requerida. Formato Y-m-d', 'data' => []], 400);
        }

        $d = \DateTime::createFromFormat('Y-m-d', $fecha);
        if (!($d && $d->format('Y-m-d') === $fecha)) {
            return $this->respond(['success' => false, 'message' => 'Formato de fecha inválido, use Y-m-d', 'data' => []], 400);
        }

        try {
            $db = \Config\Database::connect();
            $rendRows = $db->table('rendicion')->select('id, fecha, hora')->where('fecha', $fecha)->orderBy('hora', 'DESC')->get()->getResultArray();

            if (empty($rendRows)) {
                return $this->respond(['success' => false, 'message' => 'No se encontraron rendiciones para la fecha', 'data' => []], 200);
            }

            $userModel = new \App\Models\UsuarioModel();
            $result = [];

            foreach ($rendRows as $r) {
                $usuarios = $userModel->getUsuariosPorRendicionConPreguntas((int)$r['id']);
                $result[] = [
                    'id_rendicion' => (int)$r['id'],
                    'fecha' => $r['fecha'],
                    'hora'  => $r['hora'],
                    'usuarios' => $usuarios
                ];
            }

            $hasAnyUsers = false;
            foreach ($result as $r) {
                if (!empty($r['usuarios'])) { $hasAnyUsers = true; break; }
            }

            return $this->respond([
                'success' => $hasAnyUsers,
                'message' => $hasAnyUsers ? 'Usuarios por fecha obtenidos' : 'No se encontraron usuarios para las rendiciones de la fecha',
                'data' => $hasAnyUsers ? $result : []
            ], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error obteniendo usuarios por fecha', 'data' => []], 500);
        }
    }
}