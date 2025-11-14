<?php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\HistorialAdminModel;

class HistorialAdminController extends ResourceController
{
    protected $format = 'json';

    /**
     * listarHistorial
     * Devuelve todo el historial de administradores.
     */
    public function listarHistorial()
    {
        try {
            $model = new HistorialAdminModel();
            $data = $model->findAll();
            return $this->respond(['status' => 'success', 'message' => 'Historial obtenido', 'data' => $data]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error obteniendo historial'], 500);
        }
    }

    /**
     * historialPorAdministrador
     * Lista acciones realizadas por un administrador (id).
     */
    public function historialPorAdministrador($idAdmin = null)
    {
        try {
            $model = new HistorialAdminModel();
            $data = $model->where('id_admin', $idAdmin)->findAll();
            return $this->respond(['status' => 'success', 'message' => 'Historial por admin', 'data' => $data]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['status' => 'error', 'message' => 'Error obteniendo historial por admin'], 500);
        }
    }
}