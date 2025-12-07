<?php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class HistorialAdminController extends ResourceController
{
    protected $format = 'json';

    /**
     * listarHistorial
     * Devuelve historial paginado con nombre y dni del admin afectado y del que realiza la acción.
     * Query params: ?page=1&per_page=10
     */
    public function listarHistorial()
    {
        try {
            $page = (int)($this->request->getGet('page') ?? 1);
            $perPage = (int)($this->request->getGet('per_page') ?? 10);
            $page = max(1, $page);
            $perPage = max(1, min(100, $perPage));
            $offset = ($page - 1) * $perPage;

            $db = \Config\Database::connect();
            $totalRow = $db->query("SELECT COUNT(*) AS cnt FROM historial_admin")->getRowArray();
            $total = isset($totalRow['cnt']) ? (int)$totalRow['cnt'] : 0;

            $sql = "
                SELECT 
                    h.id,
                    h.id_admin,
                    h.accion,
                    h.motivo,
                    h.realizado_por,
                    h.created_at,
                    h.updated_at,
                    a.nombre AS admin_nombre,
                    a.dni    AS admin_dni,
                    r.nombre AS realizado_nombre,
                    r.dni    AS realizado_dni
                FROM historial_admin h
                LEFT JOIN administrador a ON a.id = h.id_admin
                LEFT JOIN administrador r ON r.id = h.realizado_por
                ORDER BY h.created_at DESC
                LIMIT ? OFFSET ?
            ";
            $items = $db->query($sql, [$perPage, $offset])->getResultArray();

            $totalPages = $perPage > 0 ? (int)ceil($total / $perPage) : 1;

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Historial obtenido',
                'data' => [
                    'items' => $items,
                    'pagination' => [
                        'total' => $total,
                        'per_page' => $perPage,
                        'current_page' => $page,
                        'total_pages' => $totalPages,
                        'has_next' => $page < $totalPages,
                        'has_prev' => $page > 1
                    ]
                ]
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'HistorialAdminController::listarHistorial error: ' . $e->getMessage());
            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Error obteniendo historial'
            ]);
        }
    }

    /**
     * historialPorAdministrador
     * Lista acciones realizadas sobre un administrador (id) — paginado.
     * Query params: ?page=1&per_page=10
     */
    public function historialPorAdministrador($idAdmin = null)
    {
        try {
            $idAdmin = (int)$idAdmin;
            if ($idAdmin <= 0) {
                return $this->response->setStatusCode(400)->setJSON([
                    'success' => false,
                    'message' => 'ID de administrador inválido'
                ]);
            }

            $page = (int)($this->request->getGet('page') ?? 1);
            $perPage = (int)($this->request->getGet('per_page') ?? 10);
            $page = max(1, $page);
            $perPage = max(1, min(100, $perPage));
            $offset = ($page - 1) * $perPage;

            $db = \Config\Database::connect();
            $totalRow = $db->query("SELECT COUNT(*) AS cnt FROM historial_admin WHERE id_admin = ?", [$idAdmin])->getRowArray();
            $total = isset($totalRow['cnt']) ? (int)$totalRow['cnt'] : 0;

            $sql = "
                SELECT 
                    h.id,
                    h.id_admin,
                    h.accion,
                    h.motivo,
                    h.realizado_por,
                    h.created_at,
                    h.updated_at,
                    a.nombre AS admin_nombre,
                    a.dni    AS admin_dni,
                    r.nombre AS realizado_nombre,
                    r.dni    AS realizado_dni
                FROM historial_admin h
                LEFT JOIN administrador a ON a.id = h.id_admin
                LEFT JOIN administrador r ON r.id = h.realizado_por
                WHERE h.id_admin = ?
                ORDER BY h.created_at DESC
                LIMIT ? OFFSET ?
            ";
            $items = $db->query($sql, [$idAdmin, $perPage, $offset])->getResultArray();

            $totalPages = $perPage > 0 ? (int)ceil($total / $perPage) : 1;

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Historial por administrador obtenido',
                'data' => [
                    'items' => $items,
                    'pagination' => [
                        'total' => $total,
                        'per_page' => $perPage,
                        'current_page' => $page,
                        'total_pages' => $totalPages,
                        'has_next' => $page < $totalPages,
                        'has_prev' => $page > 1
                    ]
                ]
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'HistorialAdminController::historialPorAdministrador error: ' . $e->getMessage());
            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Error obteniendo historial por administrador'
            ]);
        }
    }
}