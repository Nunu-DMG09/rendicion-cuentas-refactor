<?php
namespace App\Models;

use CodeIgniter\Model;

class EjeSeleccionadoModel extends Model
{
    protected $table      = 'eje_seleccionado';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    protected $allowedFields = [
        'id_rendicion',
        'id_eje',
        'cantidad_pregunta'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules = [
        'id_rendicion'      => 'required|integer',
        'id_eje'            => 'required|integer',
        'cantidad_pregunta' => 'required|integer'
    ];

    protected $validationMessages = [
        'id_rendicion' => [
            'required' => 'El campo {field} es obligatorio.',
            'integer'  => 'El campo {field} debe ser un número entero.'
        ],
        'id_eje' => [
            'required' => 'El campo {field} es obligatorio.',
            'integer'  => 'El campo {field} debe ser un número entero.'
        ],
        'cantidad_pregunta' => [
            'required' => 'El campo {field} es obligatorio.',
            'integer'  => 'El campo {field} debe ser un número entero.'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}