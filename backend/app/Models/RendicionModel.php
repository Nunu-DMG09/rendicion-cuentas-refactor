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
        'path' 
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
}