<?php
namespace App\Models;

use CodeIgniter\Model;

class UsuarioModel extends Model
{
    protected $table      = 'usuario';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    protected $allowedFields = [
        'nombre',
        'sexo',
        'tipo_participacion',
        'titulo',
        'ruc_empresa',
        'nombre_empresa',
        'dni',
        'id_rendicion',
        'asistencia'
    ];

    // Dates & Soft Deletes
    protected $useTimestamps = true;
    protected $useSoftDeletes = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules = [
        'nombre' => 'required|string|max_length[60]',
        'sexo'   => 'required|in_list[M,F]',
        'tipo_participacion' => 'required|in_list[asistente,orador]',
        'titulo' => 'permit_empty|in_list[PERSONAL,ORGANIZACION]',
        'ruc_empresa' => 'permit_empty|numeric|max_length[11]',
        'nombre_empresa' => 'permit_empty|string|max_length[100]',
        'dni' => 'permit_empty|alpha_numeric|max_length[12]',
        'id_rendicion' => 'permit_empty|integer',
        'asistencia' => 'required|in_list[si,no]'
    ];

    protected $validationMessages = [
        'nombre' => [
            'required' => 'El campo {field} es obligatorio.',
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'sexo' => [
            'required' => 'El campo {field} es obligatorio.',
            'in_list' => 'El campo {field} debe ser M o F.'
        ],
        'tipo_participacion' => [
            'required' => 'El campo {field} es obligatorio.',
            'in_list' => 'El campo {field} no es válido.'
        ],
        'ruc_empresa' => [
            'numeric' => 'El campo {field} debe ser numérico.',
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'asistencia' => [
            'required' => 'El campo {field} es obligatorio.',
            'in_list' => 'El campo {field} debe ser si o no.'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;


    /*=======================================
    OBTENER USUARIOS POR TIPO (ASISTENTE U ORADOR)
    ===========================================*/
    public function getUsuariosPorTipo(string $tipo): array
    {
        $db = \Config\Database::connect();
        $builder = $db->table($this->table . ' u');

        $builder->select('u.id,u.nombre,u.dni,u.sexo,u.tipo_participacion,u.titulo,u.ruc_empresa,u.nombre_empresa,u.id_rendicion,u.asistencia,u.created_at');

        if ($tipo === 'orador') {
            
            $builder->select('p.id AS pregunta_id, p.contenido AS pregunta_contenido, p.id_eje');
            $builder->join('pregunta p', 'p.id_usuario = u.id', 'left');
        }

        $builder->where('u.tipo_participacion', $tipo);
        $builder->orderBy('u.id', 'ASC');

        $rows = $builder->get()->getResultArray();

        if ($tipo !== 'orador') {
            
            return $rows;
        }

        $grouped = [];
        foreach ($rows as $row) {
            $uid = (int)$row['id'];
            if (!isset($grouped[$uid])) {
                $grouped[$uid] = [
                    'id' => $uid,
                    'nombre' => $row['nombre'],
                    'dni' => $row['dni'],
                    'sexo' => $row['sexo'],
                    'titulo' => $row['titulo'],
                    'ruc_empresa' => $row['ruc_empresa'],
                    'nombre_empresa' => $row['nombre_empresa'],
                    'id_rendicion' => $row['id_rendicion'],
                    'asistencia' => $row['asistencia'],
                    'created_at' => $row['created_at'] ?? null,
                    'preguntas' => []
                ];
            }

            if (!empty($row['pregunta_id'])) {
                $grouped[$uid]['preguntas'][] = [
                    'id' => (int)$row['pregunta_id'],
                    'contenido' => $row['pregunta_contenido'],
                    'id_eje' => $row['id_eje'] !== null ? (int)$row['id_eje'] : null
                ];
            }
        }

        return array_values($grouped);
    }

    public function getAsistentes(): array
    {
        return $this->getUsuariosPorTipo('asistente');
    }

    public function getOradores(): array
    {
        return $this->getUsuariosPorTipo('orador');
    }

    /**
     * Obtener usuarios (participantes) de una rendición con sus preguntas agrupadas.
     *
     * @param int $idRendicion
     * @return array
     */
    public function getUsuariosPorRendicionConPreguntas(int $idRendicion): array
    {
        $db = \Config\Database::connect();
        $sql = "
            SELECT
                u.id AS usuario_id,
                u.dni,
                u.nombre,
                u.sexo,
                u.tipo_participacion,
                u.titulo,
                u.ruc_empresa,
                u.nombre_empresa,
                u.asistencia,
                p.id AS pregunta_id,
                p.contenido AS pregunta_contenido,
                p.id_eje AS pregunta_id_eje,
                e.tematica AS eje_tematica
            FROM usuario u
            LEFT JOIN pregunta p ON p.id_usuario = u.id
            LEFT JOIN eje e ON e.id = p.id_eje
            WHERE u.id_rendicion = ?
            ORDER BY u.nombre ASC, p.id ASC
        ";

        $rows = $db->query($sql, [(int)$idRendicion])->getResultArray();

        if (empty($rows)) return [];

        $result = [];
        foreach ($rows as $row) {
            $uid = (int)$row['usuario_id'];
            if (!isset($result[$uid])) {
                $result[$uid] = [
                    'id' => $uid,
                    'dni' => $row['dni'],
                    'nombre' => $row['nombre'],
                    'sexo' => $row['sexo'],
                    'tipo_participacion' => $row['tipo_participacion'],
                    'titulo' => $row['titulo'],
                    'ruc_empresa' => $row['ruc_empresa'],
                    'nombre_empresa' => $row['nombre_empresa'],
                    'asistencia' => $row['asistencia'],
                    'preguntas' => []
                ];
            }

            if (!empty($row['pregunta_id'])) {
                $result[$uid]['preguntas'][] = [
                    'id' => (int)$row['pregunta_id'],
                    'contenido' => $row['pregunta_contenido'],
                    'id_eje' => $row['pregunta_id_eje'] !== null ? (int)$row['pregunta_id_eje'] : null,
                    'eje_tematica' => $row['eje_tematica'] ?? null
                ];
            }
        }

        return array_values($result);
    }
}