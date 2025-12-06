<?php
namespace App\Models;

use CodeIgniter\Model;

class AdministradorModel extends Model
{
    protected $table      = 'administrador';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    protected $allowedFields = [
        'dni',
        'nombre',
        'password',
        'categoria',
        'estado',
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
        'dni'       => 'required|alpha_numeric|max_length[8]',
        'nombre'    => 'required|string|max_length[255]',
        // password will be hashed before insert/update; keep min length for raw password checks
        'password'  => 'required|string|min_length[8]',
        'categoria' => 'required|in_list[admin,super_admin]',
        'estado'    => 'required|integer|in_list[0,1]'
    ];

    protected $validationMessages = [
        'dni' => [
            'required' => 'El campo {field} es obligatorio.',
            'alpha_numeric' => 'El campo {field} sólo puede contener números y letras.',
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'nombre' => [
            'required' => 'El campo {field} es obligatorio.',
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'password' => [
            'required' => 'El campo {field} es obligatorio.',
            'min_length' => 'El campo {field} debe tener al menos {param} caracteres.'
        ],
        'categoria' => [
            'required' => 'El campo {field} es obligatorio.',
            'in_list'  => 'El campo {field} no es válido.'
        ],
        'estado' => [
            'required' => 'El campo {field} es obligatorio.',
            'integer'  => 'El campo {field} debe ser un número.',
            'in_list'  => 'El campo {field} debe ser 0 o 1.'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    // -----------------------
    // Helper methods
    // -----------------------

    /*===============================
    CREA ADMINISTRADOR
    ===============================*/
    
    public function createAdministrador(array $data)
    {
        if (empty($data['password'])) {
            return false;
        }
        // hash password
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        return $this->insert($data);
    }

    /*===============================
    ACTUALIZA CONTRASEÑA Y/O CATEGORÍA DE ADMINISTRADOR
    ===============================*/
    public function updateAdministrador(int $id, string $newPassword, ?string $newCategoria = null)
    {
        $data = [
            'password' => password_hash($newPassword, PASSWORD_BCRYPT),
        ];

        if ($newCategoria !== null) {
            $data['categoria'] = $newCategoria;
        }

        return $this->update($id, $data);
    }

    /*===============================
    DESABILITA/HABILITA ADMINISTRADOR
    ===============================*/
    public function eliminarAdministrador(int $id)
    {
        return $this->delete($id);
    }

    /**
     * Buscar administrador por DNI.
     * Retorna array|null
     */
    public function findByDni(string $dni)
    {
        return $this->where('dni', $dni)->first();
    }

    /**
     * Retorna lista de rendiciones con id y título en formato romano.
     * Si $year es un string con 4 dígitos filtra por ese año, si no devuelve todas ordenadas desc.
     *
     * @param string|null $year
     * @return array
     */
    public function getRendicionesList(?string $year = null): array
    {
        try {
            $db = \Config\Database::connect();
            $sql = "SELECT id, fecha, hora FROM rendicion";
            $params = [];

            if (!empty($year) && preg_match('/^\d{4}$/', $year)) {
                $sql .= " WHERE YEAR(fecha) = ?";
                $params[] = $year;
            }

            $sql .= " ORDER BY fecha DESC, hora DESC";

            $rows = $db->query($sql, $params)->getResultArray();

            $result = array_map(function($r) use ($db) {
                $yearRow = isset($r['fecha']) ? date('Y', strtotime($r['fecha'])) : date('Y');

                $posRow = $db->query("
                    SELECT COUNT(*) AS pos
                    FROM rendicion
                    WHERE YEAR(fecha) = ? AND (fecha < ? OR (fecha = ? AND COALESCE(hora,'00:00:00') <= COALESCE(?, '00:00:00')))
                ", [$yearRow, $r['fecha'], $r['fecha'], $r['hora']])->getRowArray();

                $pos = max(1, (int)($posRow['pos'] ?? 1));
                $numeroRomano = $this->convertToRoman($pos);
                $titulo = "Rendición {$numeroRomano} del año {$yearRow}";

                return [
                    'id' => (int)$r['id'],
                    'titulo' => $titulo
                ];
            }, $rows);

            return $result;
        } catch (\Throwable $e) {
            log_message('error', 'AdministradorModel::getRendicionesList error: ' . $e->getMessage());
            return [];
        }
    }


    /*==============================
    OBTIENE ESTADÍSTICAS PARA DASHBOARD
    ==============================*/
    public function getDashboardStatistics(int $adminId = null): array
    {
        try {
            $db = \Config\Database::connect();
            $today = date('Y-m-d');
            $currentYear = date('Y');

            $totalRendiciones = (int) $db->table('rendicion')
                ->where("YEAR(fecha) = {$currentYear}", null, false)
                ->countAllResults();

            $rendicionesRealizadas = (int) $db->table('rendicion')
                ->where("YEAR(fecha) = {$currentYear}", null, false)
                ->where('fecha <=', $today)
                ->countAllResults();

            $totalAsistentes = (int) $db->table('usuario')
                ->where("YEAR(created_at) = {$currentYear}", null, false)
                ->where('tipo_participacion', 'asistente')
                ->countAllResults();

            $totalOradores = (int) $db->table('usuario')
                ->where("YEAR(created_at) = {$currentYear}", null, false)
                ->where('tipo_participacion', 'orador')
                ->countAllResults();

            $preguntasRecibidas = (int) $db->table('pregunta')
                ->where("YEAR(created_at) = {$currentYear}", null, false)
                ->countAllResults();

            $hasRespondidaCol = !empty($db->query("SHOW COLUMNS FROM `pregunta` LIKE 'respondida'")->getResultArray());
            $preguntasRespondidas = 0;
            if ($hasRespondidaCol) {
                $preguntasRespondidas = (int) $db->table('pregunta')
                    ->where("YEAR(created_at) = {$currentYear}", null, false)
                    ->where('respondida', 1)
                    ->countAllResults();
            }
            $preguntasPendientes = max(0, $preguntasRecibidas - $preguntasRespondidas);

            $asistentesPorMes = $db->query("
                SELECT DATE_FORMAT(created_at, '%Y-%m') AS mes, COUNT(*) AS total
                FROM usuario
                WHERE tipo_participacion = 'asistente'
                  AND YEAR(created_at) = ?
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY mes DESC
            ", [$currentYear])->getResultArray();

            $preguntasPorMes = $db->query("
                SELECT DATE_FORMAT(created_at, '%Y-%m') AS mes, COUNT(*) AS total
                FROM pregunta
                WHERE YEAR(created_at) = ?
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY mes DESC
            ", [$currentYear])->getResultArray();

            $preguntasPorEje = $db->query("
                SELECT e.id, e.tematica, COUNT(p.id) AS total_preguntas
                FROM eje e
                LEFT JOIN pregunta p ON p.id_eje = e.id AND YEAR(p.created_at) = ?
                GROUP BY e.id, e.tematica
                ORDER BY total_preguntas DESC
            ", [$currentYear])->getResultArray();

            $proximasRows = $db->query("
                SELECT
                    r.*,
                    (SELECT COUNT(*) FROM usuario u WHERE u.id_rendicion = r.id) AS registrados,
                    (SELECT COUNT(*) FROM pregunta p JOIN usuario u2 ON p.id_usuario = u2.id WHERE u2.id_rendicion = r.id AND YEAR(p.created_at) = ?) AS preguntas_count
                FROM rendicion r
                WHERE r.fecha >= ?
                ORDER BY r.fecha ASC, r.hora ASC
                LIMIT 5
            ", [$currentYear, $today])->getResultArray();

            $proximasRendiciones = array_map(function($r) use ($db) {
                $year = isset($r['fecha']) ? date('Y', strtotime($r['fecha'])) : date('Y');
                $posicion = $this->getPosicionRendicionEnAno((int)($r['id'] ?? 0), (int)$year, $db);
                $numeroRomano = $this->convertToRoman($posicion);
                $titulo = "Rendición {$numeroRomano} del año {$year}";

                return [
                    'id' => $r['id'] ?? null,
                    'titulo' => $titulo,
                    'descripcion' => $r['descripcion'] ?? '',
                    'fecha' => $r['fecha'] ?? null,
                    'hora' => $r['hora'] ?? null,
                    'registrados' => isset($r['registrados']) ? (int)$r['registrados'] : 0,
                    'preguntas_count' => isset($r['preguntas_count']) ? (int)$r['preguntas_count'] : 0,
                    'estado' => strtotime($r['fecha']) <= time() ? 'Realizada' : 'Programada'
                ];
            }, $proximasRows);

            $hoyRows = $db->query("
                SELECT
                    r.*,
                    (SELECT COUNT(*) FROM usuario u WHERE u.id_rendicion = r.id) AS registrados,
                    (SELECT COUNT(*) FROM pregunta p JOIN usuario u2 ON p.id_usuario = u2.id WHERE u2.id_rendicion = r.id AND YEAR(p.created_at) = ?) AS preguntas_count
                FROM rendicion r
                WHERE r.fecha = ?
                ORDER BY r.hora ASC
            ", [$currentYear, $today])->getResultArray();

            $rendicionesHoy = array_map(function($r) use ($db) {
                $year = isset($r['fecha']) ? date('Y', strtotime($r['fecha'])) : date('Y');
                $posicion = $this->getPosicionRendicionEnAno((int)($r['id'] ?? 0), (int)$year, $db);
                $numeroRomano = $this->convertToRoman($posicion);
                $titulo = "Rendición {$numeroRomano} del año {$year}";

                return [
                    'id' => $r['id'] ?? null,
                    'titulo' => $titulo,
                    'descripcion' => $r['descripcion'] ?? '',
                    'fecha' => $r['fecha'] ?? null,
                    'hora' => $r['hora'] ?? null,
                    'registrados' => isset($r['registrados']) ? (int)$r['registrados'] : 0,
                    'preguntas_count' => isset($r['preguntas_count']) ? (int)$r['preguntas_count'] : 0,
                    'estado' => strtotime($r['fecha']) <= time() ? 'Realizada' : 'Programada'
                ];
            }, $hoyRows);

            // Actividad reciente (sin filtrar por año, mantiene comportamiento previo)
            $usuariosAct = $db->table('usuario')->select('id, nombre, tipo_participacion, created_at')->orderBy('created_at','DESC')->limit(15)->get()->getResultArray();
            $preguntasAct = $db->table('pregunta')->select('id, contenido, id_usuario, created_at')->orderBy('created_at','DESC')->limit(15)->get()->getResultArray();
            $rendAct = $db->table('rendicion')->select('id, fecha, hora, created_at')->orderBy('created_at','DESC')->limit(10)->get()->getResultArray();

            $act = [];

            foreach ($usuariosAct as $u) {
                $act[] = [
                    'type' => 'usuario',
                    'title' => 'Nuevo registro como ' . ($u['tipo_participacion'] ?? ''),
                    'subtitle' => $u['nombre'] ?? '',
                    'created_at' => $u['created_at'],
                    'administrador' => 'Sistema'
                ];
            }
            foreach ($preguntasAct as $p) {
                $userName = '';
                if (!empty($p['id_usuario'])) {
                    $urow = $db->table('usuario')->select('nombre')->where('id', (int)$p['id_usuario'])->get()->getRowArray();
                    $userName = $urow['nombre'] ?? '';
                }
                $act[] = [
                    'type' => 'pregunta',
                    'title' => 'Nueva pregunta sobre ' . ($p['contenido'] ? (strlen($p['contenido'])>60?substr($p['contenido'],0,60).'...': $p['contenido']) : '(sin contenido)'),
                    'subtitle' => $userName,
                    'created_at' => $p['created_at'],
                    'administrador' => 'Sistema'
                ];
            }
            foreach ($rendAct as $r) {
                $year = isset($r['fecha']) ? date('Y', strtotime($r['fecha'])) : date('Y');
                $pos = $this->getPosicionRendicionEnAno((int)($r['id'] ?? 0), (int)$year, $db);
                $roman = $this->convertToRoman($pos);
                $subtitle = "Rendición {$roman} del año {$year} - " . ($r['fecha'] ?? '');
                $act[] = [
                    'type' => 'rendicion',
                    'title' => 'Rendición de cuentas programada',
                    'subtitle' => $subtitle,
                    'created_at' => $r['created_at'],
                    'administrador' => 'Administrador'
                ];
            }

            usort($act, function($a,$b){
                return strtotime($b['created_at']) <=> strtotime($a['created_at']);
            });
            $actividadReciente = array_slice($act, 0, 30);

            $now = new \DateTime();
            $formatTimeAgo = function ($time) use ($now) {
                if (empty($time)) return '';
                $t = new \DateTime($time);
                $diff = $now->getTimestamp() - $t->getTimestamp();
                if ($diff < 60) return 'Hace ' . $diff . ' s';
                if ($diff < 3600) return 'Hace ' . floor($diff/60) . ' min';
                if ($diff < 86400) return 'Hace ' . floor($diff/3600) . ' h';
                return 'Hace ' . floor($diff/86400) . ' d';
            };

            $actividadReciente = array_map(function($r) use ($formatTimeAgo){
                return [
                    'type' => $r['type'],
                    'title' => $r['title'],
                    'subtitle' => $r['subtitle'],
                    'time_ago' => $formatTimeAgo($r['created_at']),
                    'datetime' => $r['created_at'],
                    'administrador' => $r['administrador'] ?? 'Sistema'
                ];
            }, $actividadReciente);

            $estadisticas = [
                'resumen_general' => [
                    'total_rendiciones' => $totalRendiciones,
                    'rendiciones_realizadas' => $rendicionesRealizadas,
                    'total_asistentes' => $totalAsistentes,
                    'total_oradores' => $totalOradores,
                    'preguntas_recibidas' => $preguntasRecibidas,
                    'preguntas_respondidas' => $preguntasRespondidas,
                    'preguntas_pendientes' => $preguntasPendientes
                ],
                'graficos' => [
                    'asistentes_por_mes' => $asistentesPorMes,
                    'preguntas_por_mes' => $preguntasPorMes,
                    'preguntas_por_eje' => $preguntasPorEje
                ],
                'actividad_reciente' => $actividadReciente,
                'rendiciones' => [
                    'programadas_hoy' => $rendicionesHoy,
                    'proximas' => $proximasRendiciones
                ]
            ];

            return $estadisticas;
        } catch (\Throwable $e) {
            log_message('error', 'AdministradorModel::getDashboardStatistics error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Convierte un entero a numeral romano (1 => I, 2 => II, ...)
     */
    private function convertToRoman(int $number): string
    {
        $map = [
            1000 => 'M', 900 => 'CM', 500 => 'D', 400 => 'CD',
            100 => 'C', 90 => 'XC', 50 => 'L', 40 => 'XL',
            10 => 'X', 9 => 'IX', 5 => 'V', 4 => 'IV', 1 => 'I'
        ];
        $result = '';
        $num = max(1, $number);
        foreach ($map as $val => $rom) {
            while ($num >= $val) {
                $result .= $rom;
                $num -= $val;
            }
        }
        return $result ?: 'I';
    }

    /**
     * Obtiene la posición (orden) de una rendición dentro de su año.
     * Devuelve 1..N según orden ascendente por fecha/hora.
     */
    private function getPosicionRendicionEnAno(int $rendicionId, int $year, $db = null): int
    {
        try {
            $db = $db ?? \Config\Database::connect();
            $rows = $db->query("
                SELECT id FROM rendicion
                WHERE YEAR(fecha) = ?
                ORDER BY fecha ASC, hora ASC
            ", [$year])->getResultArray();

            $pos = 1;
            foreach ($rows as $i => $r) {
                if ((int)$r['id'] === $rendicionId) {
                    $pos = $i + 1;
                    break;
                }
            }
            return max(1, $pos);
        } catch (\Throwable $e) {
            return 1;
        }
    }

    /*======================================================
    OBTIENE TODAS LAS PREGUNTAS YA SEAN SELECCIONADAS Y SIN SELECCIONAR
    AGRUPADAS POR EJE SELECCIONADO DE LA RENDICIÓN
     =========================================================*/
    public function getPreguntasConSeleccionPorRendicion(int $idRendicion): array
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

            foreach ($ejes as $es) {
                $ejeSelId = (int)$es['eje_sel_id'];
                $ejeId = (int)$es['eje_id'];

                $rows = $db->query("
                    SELECT
                        p.id,
                        p.contenido,
                        p.created_at,
                        u.id AS usuario_id,
                        u.nombre AS usuario_nombre,
                        p.id_eje,
                        -- 1 si existe una fila en pregunta_seleccionada (no borrada), 0 si no
                        (SELECT COUNT(*) FROM pregunta_seleccionada ps WHERE ps.id_pregunta = p.id AND ps.id_eje_seleccionado = ? AND ps.deleted_at IS NULL) AS is_selected,
                        -- fecha de selección (si existe) para ordenar por selección primero
                        (SELECT ps2.created_at FROM pregunta_seleccionada ps2 WHERE ps2.id_pregunta = p.id AND ps2.id_eje_seleccionado = ? AND ps2.deleted_at IS NULL LIMIT 1) AS fecha_seleccion
                    FROM pregunta p
                    LEFT JOIN usuario u ON u.id = p.id_usuario
                    WHERE u.id_rendicion = ?
                      AND (p.id_eje = ? OR EXISTS(
                          SELECT 1 FROM pregunta_seleccionada psx
                          WHERE psx.id_pregunta = p.id
                            AND psx.id_eje_seleccionado = ?
                            AND psx.deleted_at IS NULL
                      ))
                    ORDER BY fecha_seleccion IS NULL, fecha_seleccion ASC, p.created_at ASC
                ", [$ejeSelId, $ejeSelId, $idRendicion, $ejeId, $ejeSelId])->getResultArray();

                $preguntas = $rows ?: [];

                $result['eje_' . $ejeSelId] = [
                    'id' => $ejeSelId,
                    'eje_id' => $ejeId,
                    'tematica' => $es['tematica'],
                    'preguntas' => array_map(function($p){
                        return [
                            'id' => (int)($p['id'] ?? 0),
                            'contenido' => $p['contenido'] ?? '',
                            'usuario' => $p['usuario_nombre'] ?? '',
                            'usuario_id' => isset($p['usuario_id']) ? (int)$p['usuario_id'] : null,
                            'created_at' => $p['created_at'] ?? null,
                            'id_eje' => isset($p['id_eje']) ? (int)$p['id_eje'] : null,
                            'is_selected' => !empty($p['is_selected']) && (int)$p['is_selected'] > 0,
                            'fecha_seleccion' => $p['fecha_seleccion'] ?? null
                        ];
                    }, $preguntas)
                ];
            }

            return $result;
        } catch (\Throwable $e) {
            log_message('error', 'AdministradorModel::getPreguntasConSeleccionPorRendicion error: ' . $e->getMessage());
            return [];
        }
    }

    /*====================================================
    OBTIENE REPORTE DETALLADO DE UNA RENDICIÓN
    CON ESTADÍSTICAS Y DATOS PAGINADOS DE PARTICIPANTES
     ==========================================*/
    public function getReporteRendicion(int $idRendicion, int $page = 1, int $perPage = 10): array
    {
        try {
            $db = \Config\Database::connect();
            
            $rendicion = $db->table('rendicion')->where('id', $idRendicion)->get()->getRowArray();
            if (!$rendicion) {
                return [
                    'rendicion' => null,
                    'stats' => [],
                    'participantes' => [],
                    'pagination' => [
                        'total' => 0,
                        'per_page' => $perPage,
                        'current_page' => $page,
                        'total_pages' => 0,
                        'has_next' => false,
                        'has_prev' => false,
                        'first_page' => 1,
                        'last_page' => 1
                    ]
                ];
            }

            $year = isset($rendicion['fecha']) ? date('Y', strtotime($rendicion['fecha'])) : date('Y');
            $posicion = $this->getPosicionRendicionEnAno($idRendicion, (int)$year, $db);
            $numeroRomano = $this->convertToRoman($posicion);
            $titulo = "Rendición {$numeroRomano} del año {$year}";

            $rendicion['titulo'] = $titulo;
            $rendicion['posicion'] = $posicion;
            $rendicion['year'] = $year;

            // Estadísticas
            $totalInscritos = (int)$db->query("SELECT COUNT(*) as total FROM usuario WHERE id_rendicion = ?", [$idRendicion])->getRowArray()['total'];
            $totalAsistentes = (int)$db->query("SELECT COUNT(*) as total FROM usuario WHERE id_rendicion = ? AND asistencia = 'si'", [$idRendicion])->getRowArray()['total'];
            $totalNoAsistieron = $totalInscritos - $totalAsistentes;
            $totalOradores = (int)$db->query("SELECT COUNT(*) as total FROM usuario WHERE id_rendicion = ? AND tipo_participacion = 'orador'", [$idRendicion])->getRowArray()['total'];
            $totalConPregunta = (int)$db->query("
                SELECT COUNT(DISTINCT u.id) as total 
                FROM usuario u 
                INNER JOIN pregunta p ON p.id_usuario = u.id 
                WHERE u.id_rendicion = ?
            ", [$idRendicion])->getRowArray()['total'];
            $totalSinPreguntas = $totalInscritos - $totalConPregunta;

            $stats = [
                'total_inscritos' => $totalInscritos,
                'total_asistentes' => $totalAsistentes,
                'total_no_asistieron' => $totalNoAsistieron,
                'total_oradores' => $totalOradores,
                'total_con_pregunta' => $totalConPregunta,
                'total_sin_preguntas' => $totalSinPreguntas
            ];

            // Datos paginados
            $offset = ($page - 1) * $perPage;
            
            $participantes = $db->query("
                SELECT 
                    u.dni,
                    u.nombre,
                    u.sexo,
                    u.tipo_participacion as tipo,
                    u.ruc_empresa as ruc,
                    u.nombre_empresa as organizacion,
                    u.asistencia,
                    COALESCE(e.tematica, '') as eje,
                    COALESCE(p.contenido, '') as pregunta
                FROM usuario u
                LEFT JOIN pregunta p ON p.id_usuario = u.id
                LEFT JOIN eje e ON e.id = p.id_eje
                WHERE u.id_rendicion = ?
                ORDER BY u.nombre ASC, p.created_at ASC
                LIMIT ? OFFSET ?
            ", [$idRendicion, $perPage, $offset])->getResultArray();

            $totalPages = ceil($totalInscritos / $perPage);
            
            $pagination = [
                'total' => $totalInscritos,
                'per_page' => $perPage,
                'current_page' => $page,
                'total_pages' => $totalPages,
                'has_next' => $page < $totalPages,
                'has_prev' => $page > 1,
                'first_page' => 1,
                'last_page' => max(1, $totalPages)
            ];

            return [
                'rendicion' => $rendicion,
                'stats' => $stats,
                'participantes' => $participantes,
                'pagination' => $pagination
            ];

        } catch (\Throwable $e) {
            log_message('error', 'AdministradorModel::getReporteRendicion error: ' . $e->getMessage());
            return [
                'rendicion' => null,
                'stats' => [],
                'participantes' => [],
                'pagination' => [
                    'total' => 0,
                    'per_page' => $perPage,
                    'current_page' => $page,
                    'total_pages' => 0,
                    'has_next' => false,
                    'has_prev' => false,
                    'first_page' => 1,
                    'last_page' => 1
                ]
            ];
        }
    }

    /*====================================================
    OBTIENE REPORTE PARA EXPORTAR A EXCEL DE UNA RENDICIÓN
    CON TODOS LOS PARTICIPANTES Y SUS DATOS
     =================================================*/
    public function getReporteExcelRendicion(int $idRendicion): array
    {
        try {
            $db = \Config\Database::connect();
            
            $rendicion = $db->table('rendicion')
                ->select('id, fecha, hora')
                ->where('id', $idRendicion)
                ->get()
                ->getRowArray();
                
            if (!$rendicion) {
                return [
                    'rendicion' => null,
                    'participantes' => []
                ];
            }
            
            $year = date('Y', strtotime($rendicion['fecha']));
            $posicion = $this->getPosicionRendicionEnAno($idRendicion, (int)$year);
            $numeroRomano = $this->convertToRoman($posicion);
            $titulo = "Rendición {$numeroRomano} del año {$year}";
            
            $rendicion['titulo'] = $titulo;
            $rendicion['posicion'] = $posicion;
            $rendicion['year'] = $year;
            
            $participantes = $db->query("
                SELECT 
                    u.dni,
                    u.nombre,
                    CASE WHEN u.sexo = 'F' THEN 'Femenino' WHEN u.sexo = 'M' THEN 'Masculino' ELSE u.sexo END as sexo,
                    CASE 
                        WHEN u.tipo_participacion = 'asistente' THEN 'Asistente'
                        WHEN u.tipo_participacion = 'orador' THEN 'Orador'
                        ELSE u.tipo_participacion 
                    END as tipo,
                    COALESCE(u.ruc_empresa, '') as ruc,
                    COALESCE(u.nombre_empresa, '') as organizacion,
                    CASE WHEN u.asistencia = 'si' THEN 'Sí' ELSE 'No' END as asistencia,
                    COALESCE(e.tematica, '') as eje,
                    COALESCE(p.contenido, '') as pregunta
                FROM usuario u
                LEFT JOIN pregunta p ON p.id_usuario = u.id
                LEFT JOIN eje e ON e.id = p.id_eje
                WHERE u.id_rendicion = ?
                ORDER BY u.nombre ASC, p.created_at ASC
            ", [$idRendicion])->getResultArray();

            return [
                'rendicion' => $rendicion,
                'participantes' => $participantes
            ];

        } catch (\Throwable $e) {
            log_message('error', 'AdministradorModel::getReporteExcelRendicion error: ' . $e->getMessage());
            return [
                'rendicion' => null,
                'participantes' => []
            ];
        }
    }
}