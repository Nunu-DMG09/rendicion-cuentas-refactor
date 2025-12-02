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
      getBannersRendicionActual
      Obtiene los banners de la rendición más reciente del año actual,
      o la última registrada si no hay del año actual.
     ==============================================================*/
    public function getBannersRendicionActual(): array
    {
        try {
            $db = \Config\Database::connect();
            $currentYear = date('Y');

            // 1) obtener rendición más reciente del año actual o la última registrada
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

            // 2) intentar leer baners desde la tabla baner_rendicion (BanerRendicionModel)
            $baners = [];
            try {
                $brModel = new \App\Models\BanerRendicionModel();
                $baners = $brModel->where('id_rendicion', $rendicionId)->findAll();
            } catch (\Throwable $e) {
                $baners = [];
            }

            // 3) Normalizar y construir rutas públicas (fallback a filesystem si no hay registros)
            $normalized = [];

            // helper para construir URL absoluta relativa al host actual
            $host = $_SERVER['HTTP_HOST'] ?? 'localhost:8080';
            $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
            $baseUrl = $scheme . '://' . $host;

            if (!empty($baners)) {
                foreach ($baners as $b) {
                    $file = $b['file_path'] ?? $b['file'] ?? $b['ruta'] ?? '';
                    $fsPath = FCPATH . 'uploads' . DIRECTORY_SEPARATOR . 'rendicion' . DIRECTORY_SEPARATOR . $rendicionId . DIRECTORY_SEPARATOR . $file;
                    $rutaPublic = $baseUrl . '/uploads/rendicion/' . $rendicionId . '/' . $file;
                    // si no existe en FS, mantener ruta pero marcar raw
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
                // fallback: listar archivos en public/uploads/rendicion/{id}/
                $dir = FCPATH . 'uploads' . DIRECTORY_SEPARATOR . 'rendicion' . DIRECTORY_SEPARATOR . $rendicionId . DIRECTORY_SEPARATOR;
                if (is_dir($dir)) {
                    $files = array_values(array_filter(scandir($dir), function($f){
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
      getDatosRendicionParaRegistro
      Obtiene datos de la rendición más actual para el formulario de registro.
     ========================================================*/
    public function getDatosRendicionParaRegistro(): array
    {
        try {
            $db = \Config\Database::connect();
            $currentYear = date('Y');

            // Buscar rendición más reciente del año actual
            $rendicion = $db->query("
                SELECT * FROM rendicion 
                WHERE YEAR(fecha) = ? 
                ORDER BY fecha DESC, hora DESC 
                LIMIT 1
            ", [$currentYear])->getRowArray();

            // Si no hay del año actual, buscar la última registrada
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

            // Generar título en formato "Rendición I del año XXXX" o "Rendición II del año XXXX"
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
     * getRendicionesAnoActualConPreguntas
     * Obtiene todas las rendiciones del año actual con sus preguntas para mostrar en home.
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
                // Si no hay del año actual, traer las del último año que tenga rendiciones
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
                // Generar título
                $year = date('Y', strtotime($r['fecha']));
                $posicion = $this->getPosicionRendicionEnAno($r['id'], $year);
                $numeroRomano = $this->convertToRoman($posicion);
                $titulo = "Rendición {$numeroRomano} del año {$year}";

                // Contar preguntas de esta rendición
                $totalPreguntas = $db->query("
                    SELECT COUNT(p.id) as total
                    FROM pregunta p
                    JOIN usuario u ON u.id = p.id_usuario
                    WHERE u.id_rendicion = ?
                ", [$r['id']])->getRowArray();

                // Contar usuarios registrados
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
                    'estado' => strtotime($r['fecha']) <= time() ? 'Realizada' : 'Programada'
                ];
            }

            return $result;
        } catch (\Throwable $e) {
            log_message('error', 'RendicionModel::getRendicionesAnoActualConPreguntas error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Helper: convierte número a romano
     */
    private function convertToRoman(int $number): string
    {
        $romans = [
            10 => 'X', 9 => 'IX', 5 => 'V', 4 => 'IV', 1 => 'I'
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

    /**
     * Helper: obtiene la posición de una rendición en su año
     */
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
}