<?php
namespace App\Models;

use CodeIgniter\Model;

class HistorialAdminModel extends Model
{
    protected $table      = 'historial_admin';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    protected $allowedFields = [
        'id_admin',
        'accion',
        'motivo',
        'realizado_por'
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
        'id_admin'     => 'required|integer',
        'accion'       => 'required|string|max_length[50]',
        'realizado_por'=> 'required|integer'
    ];

    protected $validationMessages = [
        'id_admin' => [
            'required' => 'El campo {field} es obligatorio.',
            'integer'  => 'El campo {field} debe ser un número entero.'
        ],
        'accion' => [
            'required' => 'El campo {field} es obligatorio.',
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'realizado_por' => [
            'required' => 'El campo {field} es obligatorio.',
            'integer'  => 'El campo {field} debe ser un número entero.'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}