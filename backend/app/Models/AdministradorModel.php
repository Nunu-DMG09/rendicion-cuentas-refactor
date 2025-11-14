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
        'estado'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $deletedField  = 'deleted_at';

    // Validation
    protected $validationRules = [
        'dni'       => 'required|alpha_numeric|max_length[8]',
        'nombre'    => 'required|string|max_length[255]',
        'password'  => 'required|string|min_length[255]',
        'categoria' => 'required|in_list[admin,super_admin]',
        'estado'    => 'required|integer|in_list[0,1]'
    ];

    protected $validationMessages = [
        'dni' => [
            'required' => 'El campo {field} es obligatorio.',
            'alpha_numeric' => 'El campo {field} sólo puede contener números.',
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
}