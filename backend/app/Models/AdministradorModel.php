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

    /**
     * Crea un administrador. Recibe array con keys: dni,nombre,password,categoria,estado
     * Hashea la contraseña antes de guardar.
     * Retorna insert id o false.
     */
    public function createAdministrador(array $data)
    {
        if (empty($data['password'])) {
            return false;
        }
        // hash password
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        return $this->insert($data);
    }

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

    /**
     * Elimina (soft delete) administrador por id.
     * Retorna boolean/int según Model::delete
     */
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

    // ESTADISTICAS PARA EL DASHBOARD DEL ADMINISTRADOR
    public function getDashboardStatistics(int $adminId = null): array
    {
        try {
            $db = \Config\Database::connect();
            $today = date('Y-m-d');
            $currentYear = date('Y');

            // Rendiciones del año (estadísticas por año)
            $totalRendiciones = (int) $db->table('rendicion')
                ->where("YEAR(fecha) = {$currentYear}", null, false)
                ->countAllResults();

            $rendicionesRealizadas = (int) $db->table('rendicion')
                ->where("YEAR(fecha) = {$currentYear}", null, false)
                ->where('fecha <=', $today)
                ->countAllResults();

            // Usuarios del año
            $totalAsistentes = (int) $db->table('usuario')
                ->where("YEAR(created_at) = {$currentYear}", null, false)
                ->where('tipo_participacion', 'asistente')
                ->countAllResults();

            $totalOradores = (int) $db->table('usuario')
                ->where("YEAR(created_at) = {$currentYear}", null, false)
                ->where('tipo_participacion', 'orador')
                ->countAllResults();

            // Preguntas del año
            $preguntasRecibidas = (int) $db->table('pregunta')
                ->where("YEAR(created_at) = {$currentYear}", null, false)
                ->countAllResults();

            // Verificar existencia de columna 'respondida' y contar sólo del año
            $hasRespondidaCol = !empty($db->query("SHOW COLUMNS FROM `pregunta` LIKE 'respondida'")->getResultArray());
            $preguntasRespondidas = 0;
            if ($hasRespondidaCol) {
                $preguntasRespondidas = (int) $db->table('pregunta')
                    ->where("YEAR(created_at) = {$currentYear}", null, false)
                    ->where('respondida', 1)
                    ->countAllResults();
            }
            $preguntasPendientes = max(0, $preguntasRecibidas - $preguntasRespondidas);

            // Asistentes por mes (año actual)
            $asistentesPorMes = $db->query("
                SELECT DATE_FORMAT(created_at, '%Y-%m') AS mes, COUNT(*) AS total
                FROM usuario
                WHERE tipo_participacion = 'asistente'
                  AND YEAR(created_at) = ?
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY mes DESC
            ", [$currentYear])->getResultArray();

            // Preguntas por mes (año actual)
            $preguntasPorMes = $db->query("
                SELECT DATE_FORMAT(created_at, '%Y-%m') AS mes, COUNT(*) AS total
                FROM pregunta
                WHERE YEAR(created_at) = ?
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY mes DESC
            ", [$currentYear])->getResultArray();

            // Preguntas por eje (filtro por año)
            $preguntasPorEje = $db->query("
                SELECT e.id, e.tematica, COUNT(p.id) AS total_preguntas
                FROM eje e
                LEFT JOIN pregunta p ON p.id_eje = e.id AND YEAR(p.created_at) = ?
                GROUP BY e.id, e.tematica
                ORDER BY total_preguntas DESC
            ", [$currentYear])->getResultArray();

            // Próximas rendiciones (cualquier año, pero título se genera por año de la rendición)
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

            // Rendiciones programadas para hoy (título en romano según su año)
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
}