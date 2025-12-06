<?php
namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\AdministradorModel;
use App\Models\HistorialAdminModel;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

helper('cookie');
helper('jwt');

class AdministradorController extends ResourceController
{
    protected $format = 'json';

    private function authAdmin()
    {
        $token = get_cookie('access_token');

        if (!$token) {
            return $this->respond(['success' => false, 'message' => 'No autenticado', 'data' => []], 401);
        }

        try {
            $decoded = verifyJWT($token);

            if (!isset($decoded->data->dni)) {
                return $this->respond(['success' => false, 'message' => 'Token inválido', 'data' => []], 401);
            }

            $adminModel = new \App\Models\AdministradorModel();
            $admin = $adminModel->where('dni', $decoded->data->dni)->first();

            if (!$admin) {
                return $this->respond(['success' => false, 'message' => 'Admin no encontrado', 'data' => []], 404);
            }

            return $admin;
        } catch (\Throwable $e) {
            return $this->respond(['success' => false, 'message' => 'Token inválido: ' . $e->getMessage(), 'data' => []], 401);
        }
    }

    public function listarAdministradores()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        try {
            $model = new AdministradorModel();
            $data = $model->findAll();
            // No devolver password
            foreach ($data as &$item) {
                if (isset($item['password'])) unset($item['password']);
            }
            $has = !empty($data);
            return $this->respond(['success' => $has, 'message' => $has ? 'Administradores obtenidos' : 'No se encontraron administradores', 'data' => $has ? $data : []], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error obteniendo administradores', 'data' => []], 500);
        }
    }

    public function crearAdministrador()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        $input = $this->request->getJSON(true);
        if (!$input) return $this->respond(['success' => false, 'message' => 'Payload inválido', 'data' => []], 400);

        $required = ['dni', 'nombre', 'password', 'categoria'];
        foreach ($required as $f) {
            if (empty($input[$f])) return $this->respond(['success' => false, 'message' => "$f es requerido", 'data' => []], 400);
        }

        $model = new AdministradorModel();
        try {
            $data = [
                'dni'      => $input['dni'],
                'nombre'   => $input['nombre'],
                'password' => $input['password'],
                'categoria'=> $input['categoria'],
                'estado'   => isset($input['estado']) ? (int)$input['estado'] : 1
            ];

            $id = $model->createAdministrador($data);
            if ($id === false) {
                $errors = $model->errors();
                return $this->respond(['success' => false, 'message' => 'No se pudo crear administrador', 'data' => $errors], 422);
            }

            $created = $model->find($id);
            if (isset($created['password'])) unset($created['password']);

            try {
                $hist = new HistorialAdminModel();
                $performedBy = isset($input['realizado_por']) ? (int)$input['realizado_por'] : (int)$admin['id'];
                $hist->insert([
                    'id_admin'     => (int)$id,
                    'accion'       => 'crear',
                    'motivo'       => 'Nuevo Administrador registrado',
                    'realizado_por'=> $performedBy
                ]);
            } catch (\Throwable $h) {
                log_message('error', 'Historial crear administrador falló: ' . $h->getMessage());
            }

            return $this->respondCreated(['success' => true, 'message' => 'Administrador creado', 'data' => $created]);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error creando administrador', 'data' => []], 500);
        }
    }

    public function ActualizarAdministrador($id = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (!$id) return $this->respond(['success' => false, 'message' => 'ID requerido', 'data' => []], 400);

        $input = $this->request->getJSON(true);
        if (!is_array($input)) {
            return $this->respond(['success' => false, 'message' => 'Payload inválido', 'data' => []], 400);
        }

        $action = isset($input['action']) ? trim($input['action']) : null;
        if (!$action || !in_array($action, ['change_password', 'edit_role'], true)) {
            return $this->respond(['success' => false, 'message' => 'Action inválida. use "change_password" o "edit_role"', 'data' => []], 400);
        }

        $model = new \App\Models\AdministradorModel();

        try {
            $performedBy = isset($input['realizado_por']) ? (int)$input['realizado_por'] : (int)$admin['id'];
            $motivo = isset($input['motivo']) && trim($input['motivo']) !== '' ? $input['motivo'] : ($action === 'change_password' ? 'Actualización de contraseña' : 'Actualización de categoría');

            if ($action === 'change_password') {
                if (empty($input['password'])) {
                    return $this->respond(['success' => false, 'message' => 'password requerido para action change_password', 'data' => []], 400);
                }
                $res = $model->updateAdministrador((int)$id, (string)$input['password'], null);
            } else { // edit_role
                if (empty($input['categoria'])) {
                    return $this->respond(['success' => false, 'message' => 'categoria requerida para action edit_role', 'data' => []], 400);
                }
                $res = $model->update((int)$id, ['categoria' => $input['categoria']]);
            }

            if ($res === false) {
                $errors = $model->errors();
                return $this->respond(['success' => false, 'message' => 'No se pudo actualizar administrador', 'data' => $errors], 422);
            }

            $updated = $model->find($id);
            if (is_array($updated) && isset($updated['password'])) unset($updated['password']);

            try {
                $hist = new HistorialAdminModel();
                $hist->insert([
                    'id_admin' => (int)$id,
                    'accion' => $action,
                    'motivo' => $motivo,
                    'realizado_por' => $performedBy,
                    'created_at' => date('Y-m-d H:i:s')
                ]);
            } catch (\Throwable $h) {
                log_message('error', 'Historial actualizar administrador falló: ' . $h->getMessage());
            }

            return $this->respond(['success' => true, 'message' => 'Administrador actualizado', 'data' => $updated], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error actualizando administrador', 'data' => []], 500);
        }
    }

    public function eliminarAdministrador($id = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (!$id) return $this->respond(['success' => false, 'message' => 'ID requerido', 'data' => []], 400);

        $input = $this->request->getJSON(true);
        $action = isset($input['action']) ? trim($input['action']) : 'deshabilitar'; // default deshabilitar
        if (!in_array($action, ['habilitar', 'deshabilitar'], true)) {
            return $this->respond(['success' => false, 'message' => 'Action inválida. use "habilitar" o "deshabilitar"', 'data' => []], 400);
        }

        $performedBy = isset($input['realizado_por']) ? (int)$input['realizado_por'] : (int)$admin['id'];
        $motivo = isset($input['motivo']) && trim($input['motivo']) !== '' ? $input['motivo'] : ($action === 'habilitar' ? 'Habilitación de administrador' : 'Deshabilitación de administrador');

        $model = new AdministradorModel();
        try {
            
            $item = $model->withDeleted()->find($id);
            if (!$item) {
                return $this->respondNotFound(['success' => false, 'message' => 'Administrador no encontrado', 'data' => []]);
            }

            if ($action === 'deshabilitar') {
                $res = $model->delete((int)$id); 
            } else { 
                
                $res = $model->update((int)$id, ['deleted_at' => null, 'estado' => 1]);
            }

            if ($res === false) {
                $errors = $model->errors();
                return $this->respond(['success' => false, 'message' => 'No se pudo procesar la acción', 'data' => $errors], 422);
            }

            try {
                $hist = new HistorialAdminModel();
                $hist->insert([
                    'id_admin' => (int)$id,
                    'accion' => $action,
                    'motivo' => $motivo,
                    'realizado_por' => $performedBy,
                    'created_at' => date('Y-m-d H:i:s')
                ]);
            } catch (\Throwable $h) {
                log_message('error', 'Historial eliminar/habilitar administrador falló: ' . $h->getMessage());
            }

            $msg = $action === 'deshabilitar' ? 'Administrador deshabilitado' : 'Administrador habilitado';
            return $this->respond(['success' => true, 'message' => $msg, 'data' => []], 200);

        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error procesando la solicitud', 'data' => []], 500);
        }
    }

    /*===========================================
     BUSCAR ADMINISTRADOR POR DNI
     ===========================================*/

    public function buscarPorDNI($dni = null)
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        if (!$dni) return $this->respond(['success' => false, 'message' => 'DNI requerido', 'data' => []], 400);
        $model = new AdministradorModel();
        try {
            $item = $model->findByDni($dni);
            if (!$item) return $this->respondNotFound(['success' => false, 'message' => 'Administrador no encontrado', 'data' => []]);
            return $this->respond(['success' => true, 'message' => 'Administrador encontrado', 'data' => $item], 200);
        } catch (\Throwable $e) {
            log_message('error', $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error buscando administrador', 'data' => []], 500);
        }
    }

    /*=======================================================
     OBTIENE ESTADÍSTICAS PARA EL DASHBOARD DEL ADMINISTRADOR
     =========================================================*/
    public function DashboardStatistics()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        try {
            $model = new \App\Models\AdministradorModel();
            $estadisticas = $model->getDashboardStatistics((int) ($admin['id'] ?? 0));

            $has = !empty($estadisticas);
            return $this->respond([
                'success' => $has,
                'message' => $has ? 'Estadísticas obtenidas' : 'No se pudieron obtener estadísticas',
                'data'    => $has ? $estadisticas : []
            ], 200);
        } catch (\Throwable $e) {
            log_message('error', 'DashboardStatistics controller error: ' . $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error obteniendo estadísticas', 'data' => []], 500);
        }
    }

    /*=======================================================================
    LISTAR RENDICIONES CON FILTRO DE BÚSQUEDA ?query=2026
     =================================================*/
    public function rendicionesList()
    {
        $admin = $this->authAdmin();
        if (is_object($admin)) return $admin;

        try {
            $query = $this->request->getGet('query');
            $model = new \App\Models\AdministradorModel();
            $result = $model->getRendicionesList($query ?? null);

            return $this->respond(['success' => true, 'message' => 'Rendiciones listadas', 'data' => $result], 200);
        } catch (\Throwable $e) {
            log_message('error', 'AdministradorController::rendicionesList error: ' . $e->getMessage());
            return $this->respond(['success' => false, 'message' => 'Error listando rendiciones', 'data' => []], 500);
        }
    }
    
    /*==============================================================
    GET /admin-preguntas/{id}
    OBTIENE PREGUNTAS CON INFORMACIÓN DE SELECCIÓN POR RENDICIÓN
     ==========================================================*/
    public function preguntasConSeleccion($id = null)
    {
        $id = (int)$id;
        if ($id <= 0) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'ID de rendición inválido',
                'data' => []
            ]);
        }

        try {
            $model = new \App\Models\AdministradorModel();
            $data = $model->getPreguntasConSeleccionPorRendicion($id);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Preguntas (seleccionadas y no seleccionadas) por eje para la rendición',
                'data' => $data
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'AdministradorController::preguntasConSeleccion error: ' . $e->getMessage());
            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Error al obtener preguntas',
                'data' => []
            ]);
        }
    }

    /*======================================
    PARA SELECCIONAR / DESELECCIONAR PREGUNTAS
    ======================================*/

    public function seleccionarPreguntas()
    {
        $input = $this->request->getJSON(true);
        if (!is_array($input)) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Payload inválido',
                'data' => []
            ]);
        }

        $ids = $input['pregunta_ids'] ?? null;
        $action = isset($input['action']) ? strtolower(trim($input['action'])) : null;
        $idEjeSel = isset($input['id_eje_seleccionado']) ? (int)$input['id_eje_seleccionado'] : null;
        $adminId = isset($input['admin_id']) ? (int)$input['admin_id'] : null;

        if (!is_array($ids) || empty($ids)) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Se requieren pregunta_ids como arreglo no vacío',
                'data' => []
            ]);
        }

        if (!in_array($action, ['select', 'unselect'], true)) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Action inválida. Debe ser "select" o "unselect"',
                'data' => []
            ]);
        }

        if (!$idEjeSel || $idEjeSel <= 0) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'Se requiere id_eje_seleccionado válido',
                'data' => []
            ]);
        }

        $db = \Config\Database::connect();
        $table = $db->table('pregunta_seleccionada');
        $histModel = new \App\Models\HistorialAdminModel();

        try {
            $db->transStart();

            $processed = 0;
            $processedIds = [];

            if ($action === 'select') {
                foreach ($ids as $pid) {
                    $pid = (int)$pid;
                    if ($pid <= 0) continue;

                    $exists = (int)$db->table('pregunta_seleccionada')
                        ->where('id_eje_seleccionado', $idEjeSel)
                        ->where('id_pregunta', $pid)
                        ->countAllResults();

                    if ($exists === 0) {
                        $table->insert([
                            'id_eje_seleccionado' => $idEjeSel,
                            'id_pregunta' => $pid,
                            'created_at' => date('Y-m-d H:i:s')
                        ]);

                        if ($db->affectedRows() > 0) {
                            $processed++;
                            $processedIds[] = $pid;
                        }
                    }
                }
            } else { 
                $table->where('id_eje_seleccionado', $idEjeSel)
                      ->whereIn('id_pregunta', array_map('intval', $ids))
                      ->delete();

                $processed = $db->affectedRows();
                $processedIds = array_map('intval', $ids);
            }

            if ($adminId) {
                $histModel->insert([
                    'id_admin' => $adminId,
                    'accion' => $action === 'select' ? 'seleccionar' : 'deseleccionar',
                    'motivo' => ($action === 'select' ? 'Seleccionó preguntas: ' : 'Deseleccionó preguntas: ') . implode(',', $processedIds),
                    'realizado_por' => $adminId,
                    'created_at' => date('Y-m-d H:i:s')
                ]);
            }

            $db->transComplete();

            if ($db->transStatus() === false) {
                throw new \RuntimeException('Error en transacción de selección/deselección');
            }

            return $this->response->setJSON([
                'success' => true,
                'message' => $action === 'select' ? 'Preguntas seleccionadas correctamente' : 'Preguntas deseleccionadas correctamente',
                'data' => [
                    'action' => $action,
                    'id_eje_seleccionado' => $idEjeSel,
                    'processed_count' => $processed,
                    'pregunta_ids' => $processedIds
                ]
            ]);
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', 'AdministradorController::seleccionarPreguntas error: ' . $e->getMessage());
            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Error al procesar selección/deselección',
                'data' => []
            ]);
        }
    }

    /*========================================================
    GET /admin/reportes/{id}?page=1&per_page=10
    REPORTE DETALLADO DE RENDICIÓN CON PAGINACIÓN
     =================================================================*/
    public function reporteRendicion($id = null)
    {
        $id = (int)$id;
        if ($id <= 0) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'ID de rendición inválido',
                'data' => []
            ]);
        }

        $page = (int)($this->request->getGet('page') ?? 1);
        $perPage = (int)($this->request->getGet('per_page') ?? 10);
        
        // Validar rangos
        $page = max(1, $page);
        $perPage = max(1, min(100, $perPage)); 

        try {
            $model = new \App\Models\AdministradorModel();
            $reporte = $model->getReporteRendicion($id, $page, $perPage);

            return $this->response->setJSON([
                'success' => true,
                'message' => 'Reporte de rendición obtenido',
                'data' => $reporte
            ]);
        } catch (\Throwable $e) {
            log_message('error', 'AdministradorController::reporteRendicion error: ' . $e->getMessage());
            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Error al obtener reporte',
                'data' => []
            ]);
        }
    }

    /*========================================================
    GET /admin/reportes/{id}/excel
    DESCARGA REPORTE DE RENDICIÓN EN FORMATO EXCEL
    y lo guarda en public/rendicion_excel/{id}/
     ======================================================*/
    public function descargarExcelRendicion($id = null)
    {
        $id = (int)$id;
        if ($id <= 0) {
            return $this->response->setStatusCode(400)->setJSON([
                'success' => false,
                'message' => 'ID de rendición inválido'
            ]);
        }

        try {
            $model = new \App\Models\AdministradorModel();
            $data = $model->getReporteExcelRendicion($id);

            if (empty($data['participantes']) || !$data['rendicion']) {
                return $this->response->setStatusCode(404)->setJSON([
                    'success' => false,
                    'message' => 'No hay datos para esta rendición'
                ]);
            }

            $rendicion = $data['rendicion'];
            $participantes = $data['participantes'];
            $titulo = $rendicion['titulo'] ?? "Rendición {$id}";

            $dir = FCPATH . 'rendicion_excel' . DIRECTORY_SEPARATOR . $id . DIRECTORY_SEPARATOR;
            if (!is_dir($dir)) {
                if (!mkdir($dir, 0755, true) && !is_dir($dir)) {
                    throw new \RuntimeException('No se pudo crear el directorio para Excel');
                }
            }

            $filename = "reporte_rendicion_{$id}_" . date('Y-m-d_His') . ".xlsx";
            $filePath = $dir . $filename;

            $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            $sheet->setCellValue('A1', $titulo);
            $sheet->mergeCells('A1:I1');
            $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(16);
            $sheet->getStyle('A1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER);

            $sheet->setCellValue('A2', 'Fecha: ' . ($rendicion['fecha'] ?? ''));
            $sheet->setCellValue('D2', 'Hora: ' . ($rendicion['hora'] ?? ''));
            $sheet->mergeCells('A2:C2');
            $sheet->mergeCells('D2:F2');

            $headers = ['DNI', 'Nombre', 'Sexo', 'Tipo', 'RUC', 'Organización', 'Asistencia', 'Eje', 'Pregunta'];
            $col = 'A';
            foreach ($headers as $header) {
                $sheet->setCellValue($col . '4', $header);
                $sheet->getStyle($col . '4')->getFont()->setBold(true);
                $sheet->getStyle($col . '4')->getFill()
                    ->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
                    ->getStartColor()->setARGB('FFE0E0E0');
                $col++;
            }

            $row = 5;
            foreach ($participantes as $participante) {
                $sheet->setCellValue('A' . $row, $participante['dni'] ?? '');
                $sheet->setCellValue('B' . $row, $participante['nombre'] ?? '');
                $sheet->setCellValue('C' . $row, $participante['sexo'] ?? '');
                $sheet->setCellValue('D' . $row, $participante['tipo'] ?? '');
                $sheet->setCellValue('E' . $row, $participante['ruc'] ?? '');
                $sheet->setCellValue('F' . $row, $participante['organizacion'] ?? '');
                $sheet->setCellValue('G' . $row, $participante['asistencia'] ?? '');
                $sheet->setCellValue('H' . $row, $participante['eje'] ?? '');
                $sheet->setCellValue('I' . $row, $participante['pregunta'] ?? '');
                $row++;
            }

            foreach (range('A', 'I') as $c) {
                $sheet->getColumnDimension($c)->setAutoSize(true);
            }

            $styleArray = [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        'color' => ['argb' => 'FF000000'],
                    ],
                ],
            ];
            $sheet->getStyle('A4:I' . ($row - 1))->applyFromArray($styleArray);

            $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
            $writer->save($filePath);

            if (!is_file($filePath) || filesize($filePath) === 0) {
                throw new \RuntimeException('El archivo generado no existe o está vacío');
            }
            $handle = fopen($filePath, 'rb');
            $sig = fread($handle, 4);
            fclose($handle);
            if ($sig !== "PK\x03\x04") {
                throw new \RuntimeException('El archivo generado no tiene formato .xlsx válido (cabecera ZIP inválida).');
            }

            while (ob_get_level()) {
                ob_end_clean();
            }

            $filesize = filesize($filePath);
            $body = file_get_contents($filePath);

            // Establecer cabeceras correctas
            $this->response->setHeader('Content-Description', 'File Transfer');
            $this->response->setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            $this->response->setHeader('Content-Disposition', 'attachment; filename="' . $filename . '"');
            $this->response->setHeader('Content-Transfer-Encoding', 'binary');
            $this->response->setHeader('Expires', '0');
            $this->response->setHeader('Cache-Control', 'must-revalidate, post-check=0, pre-check=0');
            $this->response->setHeader('Pragma', 'public');
            $this->response->setHeader('Content-Length', (string)$filesize);

            return $this->response->setBody($body);

        } catch (\Throwable $e) {
            log_message('error', 'AdministradorController::descargarExcelRendicion error: ' . $e->getMessage());
            return $this->response->setStatusCode(500)->setJSON([
                'success' => false,
                'message' => 'Error al generar archivo Excel: ' . $e->getMessage()
            ]);
        }
    }
}