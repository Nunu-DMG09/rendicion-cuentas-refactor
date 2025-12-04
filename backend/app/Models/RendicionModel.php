<?php

namespace App\Models;

use CodeIgniter\Model;

class RendicionModel extends Model
{
    protected $table      = 'rendicion';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    protected $allowedFields = [
        'fecha',
        'hora',
        'created_at',
        'updated_at',
        'deleted_at'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $useSoftDeletes = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules = [
        'fecha' => 'required|valid_date[Y-m-d]',
        'hora'  => 'required'
    ];

    protected $validationMessages = [
        'fecha' => [
            'required'   => 'El campo {field} es obligatorio.',
            'valid_date' => 'El campo {field} debe tener formato {param}.'
        ],
        'hora' => [
            'required' => 'El campo {field} es obligatorio.'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;


    /*================================================
      OBTENER BANNERS DE LA RENDICIÓN MÁS RECIENTE DEL AÑO ACTUAL,
      O LA ÚLTIMA REGISTRADA SI NO HAY DEL AÑO ACTUAL.
     ==============================================================*/
    public function getBannersRendicionActual(): array
    {
        try {
            $db = \Config\Database::connect();
            $currentYear = date('Y');

            $rendicion = $db->query("
                SELECT * FROM rendicion
                WHERE YEAR(fecha) = ?
                ORDER BY fecha DESC, hora DESC
                LIMIT 1
            ", [$currentYear])->getRowArray();

            if (!$rendicion) {
                $rendicion = $db->query("
                    SELECT * FROM rendicion
                    ORDER BY fecha DESC, hora DESC
                    LIMIT 1
                ")->getRowArray();
            }

            if (!$rendicion) {
                return [];
            }

            $rendicionId = (int)$rendicion['id'];

            $baners = [];
            try {
                $brModel = new \App\Models\BanerRendicionModel();
                $baners = $brModel->where('id_rendicion', $rendicionId)->findAll();
            } catch (\Throwable $e) {
                $baners = [];
            }

            $normalized = [];

            $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8080';
            $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
            $baseUrl = $scheme . '://' . $host;

            if (!empty($baners)) {
                foreach ($baners as $b) {
                    $file = $b['file_path'] ?? $b['file'] ?? $b['ruta'] ?? '';
                    if (str_starts_with($file, 'uploads/')) {
                        $rutaPublic = $baseUrl . '/' . $file;
                        $fsPath = FCPATH . $file;
                    } else {
                        $rutaPublic = $baseUrl . '/uploads/rendicion/' . $rendicionId . '/' . $file;
                        $fsPath = FCPATH . 'uploads' . DIRECTORY_SEPARATOR . 'rendicion' . DIRECTORY_SEPARATOR . $rendicionId . DIRECTORY_SEPARATOR . $file;
                    }
                    $normalized[] = [
                        'id' => (int)($b['id'] ?? 0),
                        'ruta' => $rutaPublic,
                        'titulo' => $b['titulo'] ?? pathinfo($file, PATHINFO_FILENAME),
                        'descripcion' => $b['descripcion'] ?? '',
                        'exists' => is_file($fsPath),
                        'raw' => $b
                    ];
                }
            } else {
                $dir = FCPATH . 'uploads' . DIRECTORY_SEPARATOR . 'rendicion' . DIRECTORY_SEPARATOR . $rendicionId . DIRECTORY_SEPARATOR;
                if (is_dir($dir)) {
                    $files = array_values(array_filter(scandir($dir), function ($f) {
                        return $f !== '.' && $f !== '..' && !is_dir($f);
                    }));
                    foreach ($files as $i => $file) {
                        $rutaPublic = $baseUrl . '/uploads/rendicion/' . $rendicionId . '/' . $file;
                        $normalized[] = [
                            'id' => $i + 1,
                            'ruta' => $rutaPublic,
                            'titulo' => pathinfo($file, PATHINFO_FILENAME),
                            'descripcion' => '',
                            'exists' => true,
                            'raw' => ['file' => $file]
                        ];
                    }
                }
            }

            return [
                'rendicion' => $rendicion,
                'banners' => $normalized
            ];
        } catch (\Throwable $e) {
            log_message('error', 'RendicionModel::getBannersRendicionActual error: ' . $e->getMessage());
            return [];
        }
    }

    /*================================================
      OBTENER DATOS DE LA RENDICIÓN MÁS ACTUAL 
      PARA EL FORMULARIO DE REGISTRO
     =================================================*/
    public function getDatosRendicionParaRegistro(): array
    {
        try {
            $db = \Config\Database::connect();
            $currentYear = date('Y');

            $rendicion = $db->query("
                SELECT * FROM rendicion 
                WHERE YEAR(fecha) = ? 
                ORDER BY fecha DESC, hora DESC 
                LIMIT 1
            ", [$currentYear])->getRowArray();

            if (!$rendicion) {
                $rendicion = $db->query("
                    SELECT * FROM rendicion 
                    ORDER BY fecha DESC, hora DESC 
                    LIMIT 1
                ")->getRowArray();
            }

            if (!$rendicion) {
                return [];
            }

            $year = date('Y', strtotime($rendicion['fecha']));
            $rendicionesDelAno = $db->query("
                SELECT COUNT(*) as total 
                FROM rendicion 
                WHERE YEAR(fecha) = ?
            ", [$year])->getRowArray();

            $numeroRendicion = $rendicionesDelAno['total'] ?? 1;
            $numeroRomano = $this->convertToRoman($numeroRendicion);
            $titulo = "Rendición {$numeroRomano} del año {$year}";

            // Obtener ejes seleccionados para esta rendición
            $ejesSeleccionados = $db->query("
                SELECT e.id, e.tematica
                FROM eje_seleccionado es
                JOIN eje e ON e.id = es.id_eje
                WHERE es.id_rendicion = ?
                ORDER BY e.tematica ASC
            ", [$rendicion['id']])->getResultArray();

            return [
                'id' => $rendicion['id'],
                'titulo' => $titulo,
                'fecha' => $rendicion['fecha'],
                'hora' => $rendicion['hora'],
                'descripcion' => $rendicion['descripcion'] ?? '',
                'ejes_seleccionados' => $ejesSeleccionados
            ];
        } catch (\Throwable $e) {
            log_message('error', 'RendicionModel::getDatosRendicionParaRegistro error: ' . $e->getMessage());
            return [];
        }
    }

    /*===================================================
      OBTENER RENDICIONES DEL AÑO ACTUAL CON PREGUNTAS 
      Y USUARIOS REGISTRADOS
     ========================================================*/
    public function getRendicionesAnoActualConPreguntas(): array
    {
        try {
            $db = \Config\Database::connect();
            $currentYear = date('Y');

            $rendiciones = $db->query("
                SELECT * FROM rendicion 
                WHERE YEAR(fecha) = ? 
                ORDER BY fecha DESC, hora DESC
            ", [$currentYear])->getResultArray();

            if (empty($rendiciones)) {
                $ultimoAno = $db->query("
                    SELECT YEAR(fecha) as year 
                    FROM rendicion 
                    ORDER BY fecha DESC 
                    LIMIT 1
                ")->getRowArray();

                if ($ultimoAno) {
                    $rendiciones = $db->query("
                        SELECT * FROM rendicion 
                        WHERE YEAR(fecha) = ? 
                        ORDER BY fecha DESC, hora DESC
                    ", [$ultimoAno['year']])->getResultArray();
                }
            }

            $result = [];
            foreach ($rendiciones as $r) {
                $year = date('Y', strtotime($r['fecha']));
                $posicion = $this->getPosicionRendicionEnAno($r['id'], $year);
                $numeroRomano = $this->convertToRoman($posicion);
                $titulo = "Rendición {$numeroRomano} del año {$year}";

                $totalPreguntas = $db->query("
                    SELECT COUNT(p.id) as total
                    FROM pregunta p
                    JOIN usuario u ON u.id = p.id_usuario
                    WHERE u.id_rendicion = ?
                ", [$r['id']])->getRowArray();

                $totalUsuarios = $db->query("
                    SELECT COUNT(*) as total
                    FROM usuario
                    WHERE id_rendicion = ?
                ", [$r['id']])->getRowArray();

                $result[] = [
                    'id' => $r['id'],
                    'titulo' => $titulo,
                    'fecha' => $r['fecha'],
                    'hora' => $r['hora'],
                    'descripcion' => $r['descripcion'] ?? '',
                    'total_preguntas' => (int)($totalPreguntas['total'] ?? 0),
                    'total_registrados' => (int)($totalUsuarios['total'] ?? 0),
                    'estado' => strtotime($r['fecha']) <= time() ? 'realizada' : 'programada'
                ];
            }

            return $result;
        } catch (\Throwable $e) {
            log_message('error', 'RendicionModel::getRendicionesAnoActualConPreguntas error: ' . $e->getMessage());
            return [];
        }
    }

    /*===================================================
     CONVERTIR NÚMERO A ROMANO (1-10)
     =====================================================*/
    private function convertToRoman(int $number): string
    {
        $romans = [
            10 => 'X',
            9 => 'IX',
            5 => 'V',
            4 => 'IV',
            1 => 'I'
        ];

        $result = '';
        foreach ($romans as $value => $roman) {
            while ($number >= $value) {
                $result .= $roman;
                $number -= $value;
            }
        }

        return $result ?: 'I';
    }

    /*===================================================
     OBTENER LA POSICIÓN DE UNA RENDICIÓN EN SU AÑO
     =====================================================*/
    private function getPosicionRendicionEnAno(int $rendicionId, int $year): int
    {
        try {
            $db = \Config\Database::connect();
            $rendicionesDelAno = $db->query("
                SELECT id FROM rendicion 
                WHERE YEAR(fecha) = ? 
                ORDER BY fecha ASC, hora ASC
            ", [$year])->getResultArray();

            $posicion = 1;
            foreach ($rendicionesDelAno as $index => $r) {
                if ($r['id'] == $rendicionId) {
                    $posicion = $index + 1;
                    break;
                }
            }

            return $posicion;
        } catch (\Throwable $e) {
            return 1;
        }
    }

    /*===================================================
     OBTENER PREGUNTAS SELECCIONADAS CON SU EJE POR EL ID RENDICIÓN
     =====================================================*/
    public function getPreguntasSeleccionadasPorRendicion(int $idRendicion): array
    {
        try {
            $db = \Config\Database::connect();

            $ejes = $db->query("
                SELECT es.id AS eje_sel_id, e.id AS eje_id, e.tematica
                FROM eje_seleccionado es
                JOIN eje e ON e.id = es.id_eje
                WHERE es.id_rendicion = ?
                ORDER BY e.tematica ASC
            ", [$idRendicion])->getResultArray();

            if (empty($ejes)) {
                return [];
            }

            $result = [];

            $hasSeleccion = !empty($db->query("SHOW TABLES LIKE 'seleccion'")->getResultArray());

            foreach ($ejes as $es) {
                $preguntas = [];

                if ($hasSeleccion) {
                        
                    $rows = $db->query("
                        SELECT p.id, p.contenido, p.created_at, u.id AS usuario_id, u.nombre AS usuario_nombre, p.id_eje
                        FROM seleccion s
                        JOIN pregunta p ON p.id = s.id_pregunta
                        LEFT JOIN usuario u ON u.id = p.id_usuario
                        WHERE s.id_eje_seleccionado = ?
                        ORDER BY s.orden IS NULL, s.orden ASC, p.created_at ASC
                    ", [(int)$es['eje_sel_id']])->getResultArray();

                    $preguntas = $rows ?: [];
                } else {
                    $rows = $db->query("
                        SELECT p.id, p.contenido, p.created_at, u.id AS usuario_id, u.nombre AS usuario_nombre, p.id_eje
                        FROM pregunta p
                        JOIN usuario u ON u.id = p.id_usuario
                        WHERE u.id_rendicion = ? AND p.id_eje = ?
                        ORDER BY p.created_at ASC
                    ", [$idRendicion, (int)$es['eje_id']])->getResultArray();

                    $preguntas = $rows ?: [];
                }

                $result['eje_' . $es['eje_sel_id']] = [
                    'id' => (int)$es['eje_sel_id'],
                    'eje_id' => (int)$es['eje_id'],
                    'tematica' => $es['tematica'],
                    'preguntas' => array_map(function($p){
                        return [
                            'id' => (int)($p['id'] ?? 0),
                            'contenido' => $p['contenido'] ?? '',
                            'usuario' => $p['usuario_nombre'] ?? '',
                            'usuario_id' => isset($p['usuario_id']) ? (int)$p['usuario_id'] : null,
                            'created_at' => $p['created_at'] ?? null,
                            'id_eje' => isset($p['id_eje']) ? (int)$p['id_eje'] : null
                        ];
                    }, $preguntas)
                ];
            }

            return $result;
        } catch (\Throwable $e) {
            log_message('error', 'RendicionModel::getPreguntasSeleccionadasPorRendicion error: ' . $e->getMessage());
            return [];
        }
    }
}
