<?php
namespace App\Models;

use CodeIgniter\Model;

class EjeModel extends Model
{
    protected $table      = 'eje';
    protected $primaryKey = 'id';
    protected $returnType = 'array';

    protected $allowedFields = [
        'tematica',
        'estado',
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
        'tematica' => 'required|string|max_length[120]',
        'estado'   => 'required|integer|in_list[0,1]'
    ];

    protected $validationMessages = [
        'tematica' => [
            'required' => 'El campo {field} es obligatorio.',
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ],
        'estado' => [
            'required' => 'El campo {field} es obligatorio.',
            'integer'  => 'El campo {field} debe ser un número.',
            'in_list'  => 'El campo {field} debe ser 0 o 1.'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}