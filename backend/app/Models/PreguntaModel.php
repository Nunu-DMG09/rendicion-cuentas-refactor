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
}