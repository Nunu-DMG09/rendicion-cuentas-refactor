<?php
namespace App\Models;

use CodeIgniter\Model;

class PreguntaModel extends Model
{
    protected $table      = 'pregunta';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    protected $allowedFields = [
        'contenido',
        'id_usuario',
        'id_eje'
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
        'contenido' => 'required|string',
        'id_usuario' => 'permit_empty|integer',
        'id_eje'     => 'permit_empty|integer'
    ];

    protected $validationMessages = [
        'contenido' => [
            'required' => 'El campo {field} es obligatorio.'
        ],
        'id_usuario' => [
            'integer' => 'El campo {field} debe ser un número entero.'
        ],
        'id_eje' => [
            'integer' => 'El campo {field} debe ser un número entero.'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    /**
     * Obtener preguntas agrupadas por eje para una fecha de rendición.
     * Retorna: [
     *   { eje_id, tematica, preguntas: [ { id, contenido, id_usuario, usuario: { id, nombre, dni, ... } } ] },
     *   ...
     * ]
     *
     * @param string $fecha Formato 'Y-m-d'
     * @return array
     */
    public function getPreguntasPorFechaRendicion(string $fecha): array
    {
        $db = \Config\Database::connect();

        $sql = "
            SELECT
                r.id AS rendicion_id,
                r.fecha AS rendicion_fecha,
                e.id AS eje_id,
                e.tematica AS eje_tematica,
                p.id AS pregunta_id,
                p.contenido AS pregunta_contenido,
                p.id_usuario AS pregunta_id_usuario,
                u.id AS usuario_id,
                u.nombre AS usuario_nombre,
                u.dni AS usuario_dni,
                u.nombre_empresa AS usuario_nombre_empresa,
                u.titulo AS usuario_titulo
            FROM rendicion r
            JOIN eje_seleccionado es ON es.id_rendicion = r.id
            JOIN eje e ON e.id = es.id_eje
            JOIN pregunta p ON p.id_eje = e.id
            LEFT JOIN usuario u ON u.id = p.id_usuario
            WHERE r.fecha = ?
            ORDER BY e.id, p.id
        ";

        $rows = $db->query($sql, [$fecha])->getResultArray();

        if (empty($rows)) {
            return [];
        }

        $grouped = [];
        foreach ($rows as $row) {
            $ejeId = (int)$row['eje_id'];
            if (!isset($grouped[$ejeId])) {
                $grouped[$ejeId] = [
                    'eje_id' => $ejeId,
                    'tematica' => $row['eje_tematica'],
                    'preguntas' => []
                ];
            }

            $usuario = null;
            if (!empty($row['usuario_id'])) {
                $usuario = [
                    'id' => (int)$row['usuario_id'],
                    'nombre' => $row['usuario_nombre'],
                    'dni' => $row['usuario_dni'],
                    'nombre_empresa' => $row['usuario_nombre_empresa'],
                    'titulo' => $row['usuario_titulo']
                ];
            }

            $grouped[$ejeId]['preguntas'][] = [
                'id' => (int)$row['pregunta_id'],
                'contenido' => $row['pregunta_contenido'],
                'id_usuario' => $row['pregunta_id_usuario'] !== null ? (int)$row['pregunta_id_usuario'] : null,
                'usuario' => $usuario
            ];
        }

        return array_values($grouped);
    }
}