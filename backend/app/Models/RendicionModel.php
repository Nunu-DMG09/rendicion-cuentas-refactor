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
        'banner' 
    ];


    protected $useTimestamps = true;
    protected $useSoftDeletes = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';


    protected $validationRules = [
        'fecha'  => 'required|valid_date[Y-m-d]',
        'hora'   => 'required',
        'banner' => 'permit_empty|string|max_length[255]'
    ];

    protected $validationMessages = [
        'fecha' => [
            'required' => 'El campo {field} es obligatorio.',
            'valid_date' => 'El campo {field} debe tener formato {param}.'
        ],
        'hora' => [
            'required' => 'El campo {field} es obligatorio.'
        ],
        'banner' => [
            'max_length' => 'El campo {field} no puede exceder {param} caracteres.'
        ]
    ];

    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}